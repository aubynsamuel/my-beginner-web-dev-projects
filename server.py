import asyncio
import websockets
import json

connected_clients = {}  # Dictionary to store client WebSockets and their player IDs
player_choices = {}  # Store player choices

async def handle_client(websocket, path):
    global player_choices
    player_id = len(connected_clients) + 1
    connected_clients[websocket] = player_id
    print(f"Player {player_id} connected. Total players: {len(connected_clients)}")

    try:
        # Notify players when both are connected
        if len(connected_clients) == 1:
            await websocket.send(json.dumps({"message": "Waiting for another player..."}))
        elif len(connected_clients) == 2:
            for client, p_id in connected_clients.items():
                await client.send(json.dumps({"message": "Game starting...", "player": p_id}))

        # Handle player messages
        async for message in websocket:
            data = json.loads(message)
            choice = data.get("choice")
            player_id = data.get("player")

            if player_id and choice:
                player_choices[player_id] = choice

                # Check if both players have made their choices
                if len(player_choices) == 2:
                    await process_round(player_choices)
                    player_choices = {}  # Reset for the next round

    finally:
        del connected_clients[websocket]
        print(f"Player {player_id} disconnected. Total players: {len(connected_clients)}")

async def process_round(player_choices):
    player1_choice = player_choices.get(1)
    player2_choice = player_choices.get(2)

    result = determine_winner(player1_choice, player2_choice)

    # Send results to both clients
    for client in connected_clients:
        await client.send(json.dumps({
            "player1Choice": player1_choice,
            "player2Choice": player2_choice,
            "result": result
        }))

def determine_winner(choice1, choice2):
    if choice1 == choice2:
        return "It's a tie!"
    elif (choice1 == "Rock" and choice2 == "Scissors") or \
         (choice1 == "Paper" and choice2 == "Rock") or \
         (choice1 == "Scissors" and choice2 == "Paper"):
        return "Player 1 wins!"
    else:
        return "Player 2 wins!"

async def main():
    # Replace "localhost" with your local IP address
    async with websockets.serve(handle_client, "192.168.126.88", 8000):
        print("Server started on ws://192.168.126.88:8000")
        await asyncio.Future()  # Run forever

if __name__ == "__main__":
    asyncio.run(main())
