
# simple static web app for serving markdown files 

-> parsing .md as .html


### how it works

1. **server**: uses express.js to handle http requests
2. **markdown rendering**: converts markdown to html using the marked library
3. **views**: renders content using ejs templates
4. **structure**: clean separation between content, views, and static assets

### key components

- **express.js**: lightweight web server framework
- **marked**: markdown parser and compiler 
- **ejs**: embedded javascript templates
- **static file serving**: css and other assets

### project structure

```
markdown-server/
├── app.js          # main server file
├── content/        # markdown files stored here
│   ├── sample1.md
│   └── sample2.md
├── public/         # static assets
│   └── css/
│       └── style.css
├── views/          # ejs templates
│   ├── content.ejs # template for displaying markdown
│   └── index.ejs   # template for file listing
└── package.json    # project configuration
```

### setup instructions

1. create the project structure using the script in the second artifact
2. install dependencies:
   ```bash
   npm install
   ```
3. start the server:
   ```bash
   npm start
   ```
4. access at http://localhost:3000

### extending the app

- add syntax highlighting by integrating highlight.js
- implement a directory structure for organizing markdown files
- add a search feature
- implement github-flavored markdown with additional extensions

