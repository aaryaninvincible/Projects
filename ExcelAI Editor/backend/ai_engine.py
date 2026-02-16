import openai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
if api_key:
    client = openai.OpenAI(api_key=api_key)
else:
    client = None

SYSTEM_PROMPT = """
You are an expert Python data scientist for an Excel editing tool.
Your task is to write PANDAS code to manipulate a dataframe `df` based on user instructions.

INPUT:
- Columns: List of column names
- Head: First 5 rows of data
- User Request: Natural language instruction

OUTPUT:
- Return ONLY the executable python code. 
- Do NOT return markdown code blocks (e.g. ```python ... ```). Just the code.
- Do NOT return explanations.
- The code must assume `df` exists.
- The code must modify `df` in-place or assign the result back to `df`.
- RESTRICTION: Do NOT use `import`. Assume `pd` (pandas) and `np` (numpy) are available.
- RESTRICTION: Do NOT use `print`, `plot`, `show`.
- RESTRICTION: Do NOT read/write files (no `read_csv`, `to_excel`).

EXAMPLES:
User: "Remove rows where Age is less than 18"
Code: df = df[df['Age'] >= 18]

User: "Add a column 'Name' that combines 'First' and 'Last'"
Code: df['Name'] = df['First'] + ' ' + df['Last']

User: "Group by 'City' and sum 'Sales'"
Code: df = df.groupby('City')['Sales'].sum().reset_index()
"""

def generate_pandas_code(columns, headdata, user_prompt):
    if not client:
        return "Error: OpenAI API Key not found."

    prompt = f"""
    Current Dataframe:
    Columns: {columns}
    First 5 rows: {headdata}
    
    User Instruction: "{user_prompt}"
    
    Write the pandas code now:
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            temperature=0,
            max_tokens=500
        )
        code = response.choices[0].message.content.strip()
        
        # Cleanup: remove markdown if AI adds it despite instructions
        if code.startswith("```"):
            code = code.split("\n", 1)[1]
            if code.endswith("```"):
                code = code.rsplit("\n", 1)[0]
        if code.startswith("python"):
            code = code[6:].strip()
            
        return code
    except Exception as e:
        return f"Error calling OpenAI: {str(e)}"
