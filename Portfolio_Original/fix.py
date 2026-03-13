import sys

filepath = 'c:/Users/aryan/OneDrive/Documents/GitHub/Projects/Portfolio/index.html'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add the GitHub Projects Section
target_html = """    </section>

    <!-- About Section -->"""
replacement_html = """    </section>

    <!-- GitHub Projects Section -->
    <section id="github-projects" style="background: var(--darker); padding-top: 50px; padding-bottom: 50px;">
        <div class="container">
            <h2 class="section-title">LATEST GITHUB REPOS</h2>
            <div class="projects-grid github-projects-grid">
                <!-- GitHub projects will be loaded here dynamically -->
            </div>
            
            <div style="text-align: center; margin-top: 50px;">
                <a href="https://github.com/aaryaninvincible" class="btn btn-secondary" target="_blank" style="padding: 15px 40px; font-size: 1.1rem;">
                    <i class="fab fa-github" style="margin-right: 10px;"></i> View Full GitHub Profile
                </a>
            </div>
        </div>
    </section>

    <!-- About Section -->"""
if target_html in content:
    content = content.replace(target_html, replacement_html)
else:
    print("Could not find Target HTML 1")

# 2. Update Javascript selector
target_js = """        // Load Live GitHub Projects
        async function loadGithubProjects() {
            const githubUsername = "aaryaninvincible"; // The user's GitHub username
            const projectsGrid = document.querySelector('.projects-grid');"""
            
replacement_js = """        // Load Live GitHub Projects
        async function loadGithubProjects() {
            const githubUsername = "aaryaninvincible"; // The user's GitHub username
            const projectsGrid = document.querySelector('.github-projects-grid');"""
if target_js in content:
    content = content.replace(target_js, replacement_js)
else:
    print("Could not find Target JS")

# 3. Update the buttons in the JS payload
target_buttons = """                                    <div class="project-links">
                                        ${repo.homepage ? `<a href="${repo.homepage}" class="btn" target="_blank">Live Demo</a>` : ''}
                                        <a href="${repo.html_url}" class="btn btn-secondary" target="_blank">View Code</a>
                                    </div>"""

replacement_buttons = """                                    <div class="project-links">
                                        <a href="${repo.homepage ? repo.homepage : repo.html_url}" class="btn" target="_blank">${repo.homepage ? 'Live Demo' : 'View GitHub'}</a>
                                        <a href="${repo.html_url}" class="btn btn-secondary" target="_blank">View Code</a>
                                    </div>"""

if target_buttons in content:
    content = content.replace(target_buttons, replacement_buttons)
else:
    print("Could not find Target Buttons")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
