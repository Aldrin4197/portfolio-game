"""Rebuild the CV from existing portfolio content (requires reportlab and DejaVu fonts)."""
from pathlib import Path
from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

root = Path(__file__).resolve().parents[1]
font_root = Path('/usr/share/fonts/truetype/dejavu')
pdfmetrics.registerFont(TTFont('CVSans', str(font_root / 'DejaVuSans.ttf')))
pdfmetrics.registerFont(TTFont('CVBold', str(font_root / 'DejaVuSans-Bold.ttf')))
styles = {
    'name': ParagraphStyle('name', fontName='CVBold', fontSize=22, leading=28, spaceAfter=8, textColor=colors.HexColor('#202521')),
    'section': ParagraphStyle('section', fontName='CVBold', fontSize=9, leading=13, spaceBefore=13, spaceAfter=7, textColor=colors.HexColor('#ad481f')),
    'body': ParagraphStyle('body', fontName='CVSans', fontSize=8.5, leading=12.5, spaceAfter=6, textColor=colors.HexColor('#39433b')),
    'role': ParagraphStyle('role', fontName='CVBold', fontSize=9, leading=13, spaceAfter=3, textColor=colors.HexColor('#202521')),
}
content = []
def add(text, style='body'):
    content.append(Paragraph(text, styles[style]))

add('ALDRIN JAY B. DELOS REYES', 'name')
add('Software Developer | Electronics Engineering Graduate')
add('<link href="mailto:aldrinjay.delosreyes17@gmail.com">aldrinjay.delosreyes17@gmail.com</link> | <link href="https://github.com/Aldrin4197">github.com/Aldrin4197</link>')
add('PROFILE', 'section')
add('Self-taught software developer with a background in Electronics Engineering. Transitioned into software development at the end of 2022. Interested in web applications, embedded systems, hardware prototyping, and product and research competitions.')
add('EXPERIENCE', 'section')
for title, company, date, description in [
    ('Information Systems Analyst', 'Samar State University', 'Present', 'Managing and securing university systems while providing IT support and resolving technical issues.'),
    ('Firmware Developer', 'CreatorBox', '2022 - 2023', 'Developed and maintained firmware for embedded systems, ensuring performance and functionality.'),
    ('Special Science Teacher', 'DepEd Catbalogan', '2020 - 2022', 'Delivered engaging science lessons using hands-on experiments and technology to enhance student learning.'),
]:
    add(title + ' | ' + company, 'role')
    add(date)
    add(description)
add('TECHNICAL SKILLS', 'section')
add('Web: Laravel, PHP, Vue, React, Node.js, WordPress, HTML, CSS, JavaScript, RESTful APIs.<br/>Data: MySQL, PostgreSQL, MongoDB.<br/>Tools and hardware: Git, Figma, Notion, Embedded Systems.')
add('EDUCATION', 'section')
add('Bachelor of Science in Electronics Engineering | Samar State University', 'role')
add('July 2014 - May 2019')
add('CS50x 2023 | Introductory Computer Science Course', 'role')
add('July 2023 - December 2023')
add('CERTIFICATIONS', 'section')
add('Laravel 11 and Vue 3 Mastery | TutsPrime Online Education - Udemy | February 2025<br/>National Certificate II in Computer Systems Servicing | TESDA | April 2021<br/>Career Service Professional | Civil Service Commission | July 2017')
add('SELECTED PROJECTS', 'section')
add('SSU Digital Assets Management System | Laravel, MySQL, Vue<br/>SSU HRMO | Laravel, MySQL, Vue<br/>Air Quality Monitoring | Embedded Systems, Laravel, MySQL')
SimpleDocTemplate(str(root / 'src/assets/drin.dlr_CV.pdf'), pagesize=(595.28,841.89), rightMargin=46, leftMargin=46, topMargin=40, bottomMargin=36, title='Aldrin Jay B. Delos Reyes - CV', author='Aldrin Jay B. Delos Reyes').build(content)
