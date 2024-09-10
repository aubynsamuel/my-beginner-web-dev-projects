import asyncio
import websockets
import json

connected_clients = []
player_scores = {}
player_names = {}  # Store player names
player_choices = {}
ipAddress = "192.168.78.146"

async def handle_client(websocket, path):
    global player_scores, player_names, player_choices

    if len(connected_clients) < 2:
        connected_clients.append(websocket)

        # Ask the player for their name
        await websocket.send(json.dumps({"message": "Enter your name"}))
        name = await websocket.recv()
        player_names[websocket] = name
        player_scores[name] = 0

        if len(connected_clients) == 1:
            await websocket.send(json.dumps({"message": "Waiting for another player..."}))
        else:
            # Start the game when both players are connected
            for client in connected_clients:
                await client.send(json.dumps({
                    "message": "Game has started, select an option...",
                    "playerName": player_names[client]
                }))

    else:
        # Reject additional connections
        await websocket.send(json.dumps({"message": "Game is full. Try again later."}))
        return

    try:
        async for message in websocket:
            data = json.loads(message)
            player_name = player_names[websocket]
            choice = data.get("choice")

            if player_name and choice:
                player_choices[player_name] = choice

                # Check if both players have made their choices
                if len(player_choices) == 2:
                    players = list(player_choices.keys())
                    result = determine_winner(player_choices[players[0]], player_choices[players[1]])

                    if result == f"{players[0]} wins!":
                        player_scores[players[0]] += 1
                    elif result == f"{players[1]} wins!":
                        player_scores[players[1]] += 1

                    # Send round results to both clients
                    for client in connected_clients:
                        await client.send(json.dumps({
                            "player1Choice": player_choices[players[0]],
                            "player2Choice": player_choices[players[1]],
                            "result": result,
                            "scores": player_scores
                        }))

                    # Check if the game has ended (Best of 7)
                    if player_scores[players[0]] == 4 or player_scores[players[1]] == 4:
                        winner = players[0] if player_scores[players[0]] == 4 else players[1]
                        for client in connected_clients:
                            await client.send(json.dumps({
                                "gameOver": True,
                                "finalResult": f"Game Over! {winner} wins the series!"
                            }))
                        player_scores = {players[0]: 0, players[1]: 0}  # Reset scores
                        player_choices = {}  # Reset choices for a new game
                    else:
                        player_choices = {}  # Reset choices for the next round

    finally:
        connected_clients.remove(websocket)
        print(f"{player_names[websocket]} disconnected. Total clients: {len(connected_clients)}")
        del player_names[websocket]

def determine_winner(choice1, choice2):
    if choice1 == choice2:
        return "It's a tie!"
    elif (choice1 == "Rock" and choice2 == "Scissors") or \
         (choice1 == "Paper" and choice2 == "Rock") or \
         (choice1 == "Scissors" and choice2 == "Paper"):
        return f"{list(player_choices.keys())[0]} wins!"
    else:
        return f"{list(player_choices.keys())[1]} wins!"

async def main():
    async with websockets.serve(handle_client, ipAddress, 8000):
        print("Server started on ws://" + ipAddress +":8000")
        await asyncio.Future()  # Run forever

if __name__ == "__main__":
    asyncio.run(main())
