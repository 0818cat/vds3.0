import sys

file_path = '/Users/ncsoft/Desktop/antigravity/vds-monorepo/apps/storybook/index.html'
new_content_path = '/Users/ncsoft/Desktop/antigravity/vds-monorepo/apps/storybook/new_gallery.html'

with open(file_path, 'r') as f:
    lines = f.readlines()

with open(new_content_path, 'r') as f:
    new_content = f.read()

start_index = -1
end_index = -1

# Find start index
for i, line in enumerate(lines):
    if 'id="icon-buttons"' in line:
        start_index = i
        break

if start_index == -1:
    print("Could not find start index (id='icon-buttons')")
    sys.exit(1)

# Find end index (We know it ends before </main>)
for i, line in enumerate(lines):
    if '</main>' in line:
        end_index = i
        break

if end_index == -1:
     print("Could not find end index (</main>)")
     sys.exit(1)

print(f"Replacing lines {start_index+1} to {end_index}")
print(f"Start content: {lines[start_index].strip()}")
print(f"End content (next line will be): {lines[end_index].strip()}")

# Replace content
final_lines = lines[:start_index] + [new_content + "\n"] + lines[end_index:]

with open(file_path, 'w') as f:
    f.writelines(final_lines)

print("Success!")
