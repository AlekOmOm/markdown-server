import express from 'express';
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import dotenv from 'dotenv';
dotenv.config();
const app = express();

const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 5000;

app.use(express.static(path.resolve('./public')));

// view engine
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

const data = {
	title: 'Hello World',
	stuff: 'This is a simple example of a template using EJS',
	content: 'This is a simple example of a template using EJS',
};

// --- Routes ---

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
});




// --- Server ---

app.listen(PORT, HOST, () => {
	console.log(`Server running at http://${HOST}:${PORT}`);
});
