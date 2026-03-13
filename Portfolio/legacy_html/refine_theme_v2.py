import os
import re

directory = r"c:\Users\aryan\OneDrive\Documents\GitHub\Projects\Portfolio"

css_replacements = {
    # 1. Colors update
    r':root\s*\{[^}]*\}': r''':root {
            --primary: #38bdf8;
            --secondary: #818cf8;
            --accent: #10b981;
            --dark: #0f172a;
            --darker: #020617;
            --light: #f8fafc;
            --gray: #1e293b;
            --neon-glow: 0 0 10px rgba(56, 189, 248, 0.5);
            --glass-bg: rgba(30, 41, 59, 0.4);
            --glass-border: rgba(255, 255, 255, 0.1);
            --glass-blur: blur(16px);
            --glass-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        }''',

    r'body\.light-mode\s*\{[^}]*\}': r'''body.light-mode {
            --primary: #0284c7;
            --secondary: #4f46e5;
            --accent: #059669;
            --dark: #f8fafc;
            --darker: #e2e8f0;
            --light: #0f172a;
            --gray: #cbd5e1;
            --neon-glow: 0 0 10px rgba(2, 132, 199, 0.3);
            --glass-bg: rgba(255, 255, 255, 0.6);
            --glass-border: rgba(0, 0, 0, 0.1);
            --glass-blur: blur(16px);
            --glass-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
        }''',

    # 2. Animated background
    r'\.rgb-bg\s*\{[^}]*\}': r'''/* Glowing Liquid Glass Background */
        .rgb-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -2;
            background: var(--darker);
            overflow: hidden;
            transition: background 0.5s ease;
        }

        .rgb-bg::before, .rgb-bg::after {
            content: '';
            position: absolute;
            width: 60vw;
            height: 60vw;
            border-radius: 50%;
            filter: blur(80px);
            opacity: 0.6;
            animation: blobs 20s infinite ease-in-out alternate;
        }

        .rgb-bg::before {
            top: -10vw;
            left: -10vw;
            background: radial-gradient(circle, var(--primary) 0%, transparent 70%);
            animation-duration: 25s;
            animation-delay: -5s;
        }

        .rgb-bg::after {
            bottom: -10vw;
            right: -20vw;
            background: radial-gradient(circle, var(--secondary) 0%, transparent 70%);
        }

        @keyframes blobs {
            0% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(15vw, 10vw) scale(1.1); }
            66% { transform: translate(-10vw, 20vw) scale(0.9); }
            100% { transform: translate(0, 0) scale(1); }
        }''',

    r'\.grid-animation\s*\{[^}]*\}': r'''/* Glass frosted overlay over the blobs */
        .grid-animation {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            backdrop-filter: blur(60px);
            -webkit-backdrop-filter: blur(60px);
            background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
            pointer-events: none;
        }''',

    r'#bg-canvas\s*\{[^}]*\}': r'''#bg-canvas { display: none; }''',
    
    # 3. Headers
    r'header\s*\{[^}]*\}': r'''header {
            background-color: var(--glass-bg);
            backdrop-filter: var(--glass-blur);
            -webkit-backdrop-filter: var(--glass-blur);
            border-bottom: 1px solid var(--glass-border);
            position: fixed;
            width: 100%;
            z-index: 1000;
            top: 0;
            box-shadow: var(--glass-shadow);
            transition: all 0.3s ease;
        }''',

    # 4. Glass cards
    r'\.project-card\s*\{[^}]*\}': r'''.project-card {
            background: var(--glass-bg);
            backdrop-filter: var(--glass-blur);
            -webkit-backdrop-filter: var(--glass-blur);
            border: 1px solid var(--glass-border);
            box-shadow: var(--glass-shadow);
            border-radius: 16px;
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
        }''',

    r'\.project-card:hover\s*\{[^}]*\}': r'''.project-card:hover { 
            transform: translateY(-10px) scale(1.02);
            border-color: rgba(255,255,255,0.3);
            box-shadow: 0 15px 35px rgba(0,0,0,0.2), var(--neon-glow);
        }''',
        
    r'\.gallery-item\s*\{[^}]*\}': r'''.gallery-item {
            background: var(--glass-bg);
            backdrop-filter: var(--glass-blur);
            -webkit-backdrop-filter: var(--glass-blur);
            border: 1px solid var(--glass-border);
            box-shadow: var(--glass-shadow);
            border-radius: 16px;
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            height: 100%;
            position: relative;
        }''',
        
    r'\.gallery-item:hover\s*\{[^}]*\}': r'''.gallery-item:hover { 
            transform: translateY(-10px) scale(1.02);
            border-color: rgba(255,255,255,0.3);
            box-shadow: 0 15px 35px rgba(0,0,0,0.2), var(--neon-glow);
        }''',

    r'\.update-card\s*\{[^}]*\}': r'''.update-card {
            background: var(--glass-bg);
            backdrop-filter: var(--glass-blur);
            -webkit-backdrop-filter: var(--glass-blur);
            border: 1px solid var(--glass-border);
            box-shadow: var(--glass-shadow);
            border-radius: 16px;
            padding: 25px;
            margin-bottom: 30px;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }''',
        
    r'\.update-card:hover\s*\{[^}]*\}': r'''.update-card:hover {
            transform: translateY(-5px) scale(1.01);
            border-color: rgba(255,255,255,0.3);
            box-shadow: 0 15px 35px rgba(0,0,0,0.2), var(--neon-glow);
        }''',

    r'\.client-card\s*\{[^}]*\}': r'''.client-card {
            background: var(--glass-bg);
            backdrop-filter: var(--glass-blur);
            -webkit-backdrop-filter: var(--glass-blur);
            border: 1px solid var(--glass-border);
            box-shadow: var(--glass-shadow);
            border-radius: 16px;
            padding: 30px;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }''',
        
    r'\.client-card:hover\s*\{[^}]*\}': r'''.client-card:hover {
            transform: translateY(-5px) scale(1.02);
            border-color: rgba(255,255,255,0.3);
            box-shadow: 0 15px 35px rgba(0,0,0,0.2), var(--neon-glow);
        }''',

    r'\.skill-item\s*\{[^}]*\}': r'''.skill-item {
            background: var(--glass-bg);
            backdrop-filter: var(--glass-blur);
            -webkit-backdrop-filter: var(--glass-blur);
            border: 1px solid var(--glass-border);
            box-shadow: var(--glass-shadow);
            padding: 15px;
            border-radius: 12px;
            text-align: center;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }''',
        
    r'\.skill-item:hover\s*\{[^}]*\}': r'''.skill-item:hover {
            border-color: var(--primary);
            transform: translateY(-5px) scale(1.05);
            background: rgba(255,255,255,0.1);
        }''',

    r'\.live-update-notification\s*\{[^}]*\}': r'''.live-update-notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--glass-bg);
            backdrop-filter: var(--glass-blur);
            -webkit-backdrop-filter: var(--glass-blur);
            border: 1px solid var(--glass-border);
            border-radius: 16px;
            padding: 15px 20px;
            max-width: 350px;
            z-index: 999;
            transform: translateX(400px);
            transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }''',
        
    r'\.hero h1 span\s*\{[^}]*\}': r'''.hero h1 span {
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
            position: relative;
            display: inline-block;
        }''',

    r'\.btn\s*\{([^}]*)\}': r'''.btn {\1
            backdrop-filter: var(--glass-blur);
            -webkit-backdrop-filter: var(--glass-blur);
        }''',

    r'\.filter-btn\s*\{[^}]*\}': r'''.filter-btn {
            padding: 10px 25px;
            background: var(--glass-bg);
            backdrop-filter: var(--glass-blur);
            -webkit-backdrop-filter: var(--glass-blur);
            border: 1px solid var(--glass-border);
            color: var(--light);
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: var(--glass-shadow);
        }''',

    r'\.instagram-showcase\s*\{[^}]*\}': r'''.instagram-showcase {
            background: var(--glass-bg);
            backdrop-filter: var(--glass-blur);
            -webkit-backdrop-filter: var(--glass-blur);
            border: 1px solid var(--glass-border);
            border-radius: 20px;
            padding: 30px;
            margin: 40px 0;
            display: flex;
            align-items: center;
            gap: 30px;
            box-shadow: var(--glass-shadow);
            transition: all 0.4s ease;
        }''',
        
    r'\.instagram-showcase:hover\s*\{[^}]*\}': r'''.instagram-showcase:hover {
            transform: translateY(-5px);
            border-color: rgba(225, 48, 108, 0.3);
        }''',
        
    r'\.stat-box\s*\{[^}]*\}': r'''.stat-box {
            text-align: center;
            padding: 15px;
            background: rgba(0,0,0,0.1);
            border-radius: 12px;
            border: 1px solid var(--glass-border);
        }''',
        
    r'\.project-img\s*\{[^}]*\}': r'''.project-img {
            height: 200px;
            width: 100%;
            background-color: rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
            color: var(--primary);
            position: relative;
            overflow: hidden;
        }''',
        
    r'\.gallery-img\s*\{[^}]*\}': r'''.gallery-img {
            height: 200px;
            width: 100%;
            background-color: rgba(0,0,0,0.2);
            overflow: hidden;
            position: relative;
        }''',
        
    r'\.social-icon\s*\{[^}]*\}': r'''.social-icon {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: var(--glass-bg);
            backdrop-filter: var(--glass-blur);
            -webkit-backdrop-filter: var(--glass-blur);
            border: 1px solid var(--glass-border);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            color: var(--light);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            text-decoration: none;
            box-shadow: var(--glass-shadow);
        }''',
        
    r'\.social-icon:hover\s*\{[^}]*\}': r'''.social-icon:hover {
            color: var(--primary);
            transform: scale(1.15) translateY(-5px);
            border-color: var(--primary);
            background: var(--glass-border);
        }''',
        
     r'footer\s*\{[^}]*\}': r'''footer {
            background-color: transparent;
            padding: 40px 0;
            text-align: center;
            border-top: 1px solid var(--glass-border);
            margin-top: 50px;
            backdrop-filter: var(--glass-blur);
        }'''
}

def modify_css(content):
    new_content = content
    for pattern, substitution in css_replacements.items():
        comp_pattern = re.compile(pattern)
        new_content = comp_pattern.sub(substitution, new_content)

    return new_content

if __name__ == "__main__":
    for filename in os.listdir(directory):
        if filename.endswith(".html"):
            filepath = os.path.join(directory, filename)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = modify_css(content)
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Processed {filename}")
            except Exception as e:
                print(f"Failed {filename}: {str(e)}")
