import asyncio
import websockets

players = []  # List to store connected players

async def handle_player(websocket, path):
    global players
    # Add the connected player to the players list
    players.append(websocket)
    print("A player connected.")

    try:
        # Wait for both players to connect
        if len(players) == 2:
            await broadcast("Game starts now!")

        async for message in websocket:
            print(f"Received message: {message}")
            await broadcast(message)  # Broadcast the message to both players
    finally:
        print("A player disconnected.")
        players.remove(websocket)

# Function to send messages to all players
async def broadcast(message):
    for player in players:
        if player.open:
            await player.send(message)

# Start the WebSocket server
start_server = websockets.serve(handle_player, "localhost", 8080)

asyncio.get_event_loop().run_until_complete(start_server)
print("WebSocket server is running on ws://localhost:8080")
asyncio.get_event_loop().run_forever()

