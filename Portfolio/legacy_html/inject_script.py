import os
import re

directory = r"c:\Users\aryan\OneDrive\Documents\GitHub\Projects\Portfolio"

def add_script(content):
    if "liquid-glass-fx.js" in content:
        return content  # Already added
    
    script_tag = '\n    <script src="liquid-glass-fx.js"></script>\n'
    # Try replacing </body>
    if "</body>" in content:
        return content.replace("</body>", script_tag + "</body>")
    return content

if __name__ == "__main__":
    for filename in os.listdir(directory):
        if filename.endswith(".html"):
            filepath = os.path.join(directory, filename)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = add_script(content)
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Injected into {filename}")
            except Exception as e:
                print(f"Failed {filename}: {str(e)}")
