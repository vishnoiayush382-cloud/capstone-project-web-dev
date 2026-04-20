import re

with open('style.css', 'r') as f:
    css = f.read()

# 1. Inline variables
variables = {
    'var(--color-gold)': '#C5A059',
    'var(--color-gold-light)': '#D4B982',
    'var(--color-gold-dark)': '#A67C52',
    'var(--color-charcoal)': '#1A1A1A',
    'var(--color-text)': '#2D2D2D',
    'var(--color-text-muted)': '#555555',
    'var(--color-white)': '#FFFFFF',
    'var(--font-serif)': "'Cormorant Garamond', serif",
    'var(--font-sans)': "'Montserrat', sans-serif",
    'var(--container-width)': '1200px',
    'var(--transition-smooth)': 'all 0.5s ease-in-out'
}

for var, val in variables.items():
    css = css.replace(var, val)

# Remove :root block
css = re.sub(r':root\s*\{[^}]*\}', '', css)

# 2. Grid to Flex/Block
css = css.replace('''display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;''', '''display: flex;
    justify-content: space-between;''')
css = css.replace('align-items: center;', 'align-items: center;')

# Fixing spec-grid
css = css.replace('''display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;''', '''display: flex;
    flex-wrap: wrap;
    justify-content: center;''')

# Fixing products-grid
css = css.replace('''display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 3rem;''', '''display: flex;
    flex-wrap: wrap;
    justify-content: center;''')


# 3. Handle grid children widths manually later in this script
css += "\n/* Flex adjustments for former grids */\n"
css += ".grid-2 > * { width: 45%; }\n"
css += ".spec-card { width: 28%; margin: 1%; }\n"
css += ".product-card { width: 30%; margin: 1%; }\n"

# Medium breakpoint grid fix
css += "@media (max-width: 992px) {\n"
css += "    .grid-2 > * { width: 100%; }\n"
css += "    .spec-card { width: 45%; }\n"
css += "    .product-card { width: 45%; }\n"
css += "}\n"
css += "@media (max-width: 600px) {\n"
css += "    .spec-card { width: 100%; }\n"
css += "    .product-card { width: 100%; }\n"
css += "}\n"

# 4. Remove Transforms and animation timelines
# transform: translateY(-3px);
css = css.replace('transform: translateY(-3px);', 'position: relative; top: -3px;')
# transform: translateY(-10px);
css = css.replace('transform: translateY(-10px);', 'position: relative; top: -10px;')
# transform: scale(1.1);
css = css.replace('transform: scale(1.1);', 'width: 110%; height: 110%; margin-left: -5%; margin-top: -5%;')
# transform: translateY(0px); -> top: 0
css = css.replace('transform: translateY(0px);', 'top: 0px;')

# Replace fade-up and animation
anim_regex = re.compile(r'/\* Animations \*/.*', re.DOTALL)
new_anim = '''/* Animations */
.fade-up {
    opacity: 0;
    position: relative;
    top: 40px;
    animation: simpleFadeUp 1s ease-in-out forwards;
}

@keyframes simpleFadeUp {
    0% {
        opacity: 0;
        top: 40px;
    }
    100% {
        opacity: 1;
        top: 0;
    }
}

.floating {
    position: relative;
    animation: floatBasic 6s ease-in-out infinite;
}

@keyframes floatBasic {
    0% { top: 0px; }
    50% { top: -20px; }
    100% { top: 0px; }
}

/* Scroll Progress (Kept without edit) */
.scroll-progress {
    position: fixed;
    top: 0;
    left: 0;
    height: 4px;
    background: #C5A059;
    z-index: 1001;
    width: 0%;
}
'''

css = anim_regex.sub(new_anim, css)

# Make sure grid-template-columns in @media is removed if any
css = css.replace('grid-template-columns: 1fr;', 'flex-direction: column;')

with open('style.css', 'w') as f:
    f.write(css)

print("success")
