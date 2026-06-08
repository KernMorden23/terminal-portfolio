interface Activity {
    image: string;
    title: string;
    project: string;
    date: string;
}

interface Profile {
    image: string;
    name: string;
    stats: string;
    bioPart1: string;
    bioHighlight1: string;
    bioPart2: string;
    bioHighlight2: string;
    bioPart3: string;
    bioAccent: string;
    subBio: string;
}

interface PortfolioData {
    profile: Profile;
    activities: Activity[];
}

// 1. HARDCODED DATA (No backend needed anymore!)
const localPortfolioData: PortfolioData = {
    profile: {
        image: "/images/pfp.png",
        name: "Kern Morden",
        stats: "Computer Engineering Student | Python, C#, C++, Lua | Software Enthusiast",
        bioPart1: "A ",
        bioHighlight1: "chill guy",
        bioPart2: " & ",
        bioHighlight2: "Software Programmer Student",
        bioPart3: " from ",
        bioAccent: "Angeles",
        subBio: "Computer Engineering Student | Python, C#, C++, Lua | Software Enthusiast"
    },
    activities: [
        { image: "/images/SJDM.png", title: "Released v1.0.0", project: "Philippines SJDM Project", date: "May 03" }, // Updated
        { image: "/images/Inventory.png", title: "Committed code", project: "Inventory OS (Python/Flet)", date: "Apr 15" },
        { image: "/images/Stoplight.png", title: "Action Research Prototype", project: "ESP32 Smart Stoplight", date: "Mar 28" } // Updated
    ]
};

// 2. INJECT DATA DIRECTLY
function loadPortfolioData(): void {
    const data = localPortfolioData;
    
    const profilePicEl = document.querySelector('.profile-pic') as HTMLElement;
    if (profilePicEl) {
        profilePicEl.innerHTML = `<img src="${data.profile.image}" alt="Kern Morden" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block;">`;
    }
    
    (document.getElementById('ui-name') as HTMLElement).innerText = data.profile.name;
    (document.getElementById('ui-stats') as HTMLElement).innerText = data.profile.stats;
    
    (document.getElementById('term-name') as HTMLElement).innerText = data.profile.name;
    (document.getElementById('term-bio') as HTMLElement).innerHTML = `${data.profile.bioPart1}<span class="highlight">${data.profile.bioHighlight1}</span>${data.profile.bioPart2}<span class="highlight">${data.profile.bioHighlight2}</span>${data.profile.bioPart3}<span class="accent">${data.profile.bioAccent}</span>`;
    (document.getElementById('term-subbio') as HTMLElement).innerText = data.profile.subBio;

    const activityContainer = document.getElementById('activity-container') as HTMLElement;
    activityContainer.innerHTML = '';
    
    data.activities.forEach((activity: Activity) => {
        const itemHTML = `
            <div class="activity-item">
                <div class="activity-icon">
                    <img src="${activity.image}" alt="icon" style="width: 24px; height: 24px; object-fit: cover; border-radius: 4px;">
                </div>
                <div class="activity-details">
                    <h5>${activity.title}</h5>
                    <p>${activity.project}</p>
                    <p>${activity.date}</p>
                </div>
            </div>
        `;
        activityContainer.innerHTML += itemHTML;
    });
}

// 3. CLOCKS & TERMINAL (Unchanged)
function initClocks(): void {
    const lastLoginEl = document.getElementById('last-login') as HTMLElement;
    lastLoginEl.innerText = new Date().toDateString() + " " + new Date().toLocaleTimeString();

    function updateClocks(): void {
        const now = new Date();
        (document.getElementById('local-time') as HTMLElement).innerText = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        
        const phTime = new Intl.DateTimeFormat('en-US', {
            timeZone: 'Asia/Manila', hour: '2-digit', minute: '2-digit', hour12: false
        }).format(now);
        (document.getElementById('ph-time') as HTMLElement).innerText = phTime;
    }
    setInterval(updateClocks, 1000);
    updateClocks();
}

function initTerminal(): void {
    const terminalContent = document.querySelector('.terminal-content') as HTMLElement;

    terminalContent.addEventListener('keydown', function(e: KeyboardEvent) {
        const target = e.target as HTMLInputElement;
        
        if (target && target.classList.contains('cmd-input') && e.key === 'Enter') {
            const cmd = target.value.trim().toLowerCase();
            
            target.readOnly = true;
            target.classList.remove('cmd-input');
            target.style.color = "#8b949e";
            
            if (cmd === 'clear') {
                terminalContent.innerHTML = `<div style="color: #8b949e; margin-bottom: 20px;">Terminal history cleared.</div>`;
                createNewPrompt(terminalContent);
                return;
            }

            if (cmd !== "") {
                const responseHTML = processCommand(cmd);
                const responseDiv = document.createElement('div');
                responseDiv.style.marginBottom = "15px";
                responseDiv.style.marginTop = "5px";
                responseDiv.style.color = "#c9d1d9";
                responseDiv.innerHTML = responseHTML;
                
                target.parentElement?.insertAdjacentElement('afterend', responseDiv);
            }
            createNewPrompt(terminalContent);
        }
    });

    terminalContent.addEventListener('click', () => {
        const activeInput = document.querySelector('.cmd-input') as HTMLInputElement;
        if (activeInput) activeInput.focus();
    });
}

function processCommand(cmd: string): string {
    switch(cmd) {
        case 'help':
            return `
                <span class="accent">whoami</span>   - Display user profile<br>
                <span class="accent">skills</span>   - List technical stack<br>
                <span class="accent">projects</span> - Show recent development logs<br>
                <span class="accent">socials</span>  - Display network links<br>
                <span class="accent">github</span>   - Show source control profile<br>
                <span class="accent">clear</span>    - Wipe terminal output
            `;
        case 'whoami':
            return `Kern Morden.<br>Computer Engineering Student and Lua developer operating out of Angeles.<br>Just a chill guy building cool systems.`;
        case 'skills':
            return `
                <span class="highlight">Languages:</span> Python, C#, C++, Lua, TypeScript<br>
                <span class="highlight">Tools:</span> Flet, ESP32, Express.js, Vite, Roblox Studio
            `;
        case 'projects':
            return `
                1. <span class="accent">Philippines SJDM Project</span> (Roblox/Lua)<br>
                2. <span class="accent">Inventory OS</span> (Python/Flet)<br>
                3. <span class="accent">ESP32 Smart Stoplight</span> (Hardware/C++)
            `;
        case 'socials':
            return `
                [<span class="highlight">LinkedIn</span>] linkedin.com/in/SECRETHULAANMO<br>
                [<span class="highlight">Twitter</span>]  twitter.com/SECRETHULAANMO
            `;
        case 'github':
            return `Accessing mainframes...<br>GitHub: <a href="https://github.com/KernMorden23" target="_blank" style="color: #60a5fa; text-decoration: none;">github.com/KernMorden23</a>`;
        default:
            return `zsh: command not found: ${cmd}. Type '<span class="accent">help</span>' for available commands.`;
    }
}

function createNewPrompt(terminalContent: HTMLElement): void {
    const newPrompt = document.createElement('div');
    newPrompt.className = 'prompt-line';
    newPrompt.style.marginTop = "10px";
    newPrompt.style.display = "flex";
    newPrompt.style.alignItems = "center";
    
    newPrompt.innerHTML = `
        <span class="prompt" style="color: #3fb950; margin-right: 10px;">kern@macbook-pro ~ %</span>
        <input type="text" class="cmd-input" autofocus autocomplete="off" spellcheck="false" style="background: transparent; border: none; color: #c9d1d9; font-family: 'JetBrains Mono', monospace; font-size: 0.95rem; outline: none; flex: 1; caret-color: #58a6ff;">
    `;
    
    terminalContent.appendChild(newPrompt);
    const newInput = newPrompt.querySelector('.cmd-input') as HTMLInputElement;
    newInput.focus();
    terminalContent.scrollTop = terminalContent.scrollHeight;
}

// 4. BOOT UP
loadPortfolioData();
initClocks();
initTerminal();