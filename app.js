import express from 'express';
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve('./config/.env') });
const app = express();


// --- Configuration ---
const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(express.static(path.resolve('./public')));
app.use(express.json());

// view engine
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));


// --- Routes ---

// API endpoints for processing .md and returning HTML
 /* receives a JSON object 
  * {
  *   "title": "string",
  *   "content": "string"
  * }
  */

app.get('/api/', async (req, res) => {

    const { title, content } = await req.body;
    
    if (!title || !content) {
        res.status(400).send('Title and content required');
        return;
    }

    const htmlContent = marked.parse(content, {
        mangle: false,
        headerIds: false
    });

    res.status(200).send({ title, content: htmlContent });

});







// --- Basic Routes for localhosting from content/ dir ---

// Home
app.get('/', (req, res) => {
	fs.readdir(path.resolve('./content'), (err, files) => {
		if (err) {
			console.error(err);
			res.status(500).send('Error reading content of directory');
		}

		const mdFiles = files.filter((file) => file.endsWith('.md'));

		// render
		res.render('index', { files: mdFiles });
	});
});

// Serv file
app.get('/content/:name', (req, res) => {
	const name = req.params.name;
	const filePath = path.resolve(`./content/${name}`);

	console.log(`Reading file ${name}`);
	console.log(`File path: ${filePath}`);
	console.log(`File exists: ${fs.existsSync(filePath)}`);
	console.log(`Path of content directory: ${path.resolve('./content')}`);
	console.log(
		`Content of directory: ${fs.readdirSync(path.resolve('./content'))}`,
	);

    if (!fs.existsSync(filePath)) {
        res.status(404).send(`File ${name} not found`);
        return;
    }

    processHTML(req, res, name, filePath);

});

// read file 
function processHTML(req, res, name, filePath) {

	// read
    try {
        fs.readFile(filePath, 'utf-8', (err, content) => {
            if (err) {
                console.error(err);
                res.status(500).send(`Error reading file ${name}`);
            }

            // convert markdown to html
            const htmlContent = marked.parse(content, {
                mangle: false,
                headerIds: false
            });

            // render
            res.render('content', {
                title: name.replace('.md', ''),
                content: htmlContent,
            });
        });

    } catch (error) {
        console.error(error);
        res.status(500).send(`Error reading file ${name}`);
    }

}



// --- Server ---

app.listen(PORT, HOST, () => {
	console.log(`Server running at http://${HOST}:${PORT}`);
});
