import streamlit as st
from openai import OpenAI
import os

# Page Config (Must be first)
st.set_page_config(
    page_title="NebulaChat",
    page_icon="🌌",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# --- Custom CSS for Modern, Minimalist Look ---
st.markdown("""
<style>
    /* Global Styles */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Inter', sans-serif;
        background-color: #0e1117; /* Dark theme background */
        color: #e0e0e0;
    }

    /* Navbar */
    .navbar {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        padding: 1rem 2rem;
        border-radius: 12px;
        margin-bottom: 2rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        animation: slideDown 0.5s ease-out;
    }
    
    .navbar-brand {
        font-size: 1.5rem;
        font-weight: 600;
        background: linear-gradient(90deg, #a8c0ff, #3f2b96);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    /* Chat Messages */
    .stChatMessage {
        background-color: rgba(255, 255, 255, 0.03);
        border-radius: 10px;
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid rgba(255, 255, 255, 0.05);
        animation: fadeIn 0.4s ease-in-out;
    }
    
    [data-testid="stChatMessageContent"] {
        color: #e0e0e0;
    }

    /* User Input Styling */
    .stTextInput input {
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        background-color: rgba(255, 255, 255, 0.05);
        color: white;
        padding: 10px 15px;
    }
    
    .stTextInput input:focus {
        border-color: #a8c0ff;
        box-shadow: 0 0 0 1px #a8c0ff;
    }

    /* Footer */
    .footer {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        background-color: #0e1117;
        color: #888;
        text-align: center;
        padding: 10px;
        font-size: 0.8rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        z-index: 100;
    }

    /* Animations */
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideDown {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    /* Hide Streamlit default styling elements if needed */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}

</style>
""", unsafe_allow_html=True)

# --- Navbar ---
st.markdown("""
<div class="navbar">
    <div class="navbar-brand">🌌 NebulaChat</div>
    <div>
        <span style="margin-right: 15px; opacity: 0.7;">About</span>
        <span style="opacity: 0.7;">Contact</span>
    </div>
</div>
""", unsafe_allow_html=True)

# --- Footer ---
st.markdown("""
<div class="footer">
    <p>Powered by Groq & Streamlit | Made with 💖 for You</p>
</div>
""", unsafe_allow_html=True)

# --- Logic ---

# Initialize Client
if "client" not in st.session_state:
    st.session_state.client = OpenAI(
        base_url="https://api.groq.com/openai/v1",
        api_key="YOUR_API_KEY"
    )

if "messages" not in st.session_state:
    st.session_state.messages = [
        {"role": "system", "content": "You are a helpful, minimalist AI assistant. Keep responses concise and elegant."}
    ]

# Display Chat History
for message in st.session_state.messages:
    if message["role"] != "system":
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

# User Input
if prompt := st.chat_input("Type your message here..."):
    # Add user message to state
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    # Generate Response
    with st.chat_message("assistant"):
        message_placeholder = st.empty()
        full_response = ""
        
        try:
            chat_completion = st.session_state.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": m["role"], "content": m["content"]}
                    for m in st.session_state.messages
                ],
                stream=True,
                temperature=0.7
            )
            
            for chunk in chat_completion:
                if chunk.choices[0].delta.content:
                    full_response += chunk.choices[0].delta.content
                    message_placeholder.markdown(full_response + "▌")
            
            message_placeholder.markdown(full_response)
        
        except Exception as e:
            st.error(f"Error: {e}")
            full_response = "I'm having trouble connecting right now."

    # Add assistant response to state
    st.session_state.messages.append({"role": "assistant", "content": full_response})
