from openai import OpenAI
import os

# Initialize the client with Groq API
client = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key="YOUR_GROQ_API_KEY"
)

messages = [{"role": "system", "content": "You are a helpful assistant."}]

print("NebulaChat initialized (Powered by Groq). Type 'quit' to exit.")

while True:
    try:
        user_input = input("You: ")
        if user_input.lower() == 'quit':
            print("Goodbye!")
            break
        
        messages.append({"role": "user", "content": user_input})
        
        # Call the API
        chat = client.chat.completions.create(
            model="llama-3.3-70b-versatile", 
            messages=messages,
            temperature=0.7
        )
        
        bot_reply = chat.choices[0].message.content
        print("Bot:", bot_reply)
        
        messages.append({"role": "assistant", "content": bot_reply})
        
    except Exception as e:
        print(f"An error occurred: {e}")
