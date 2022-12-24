const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const hljs = require('highlight.js');
const { marked } = require('marked');

marked.setOptions({
	renderer: new marked.Renderer(),
	highlight: function(code, lang) {
		const language = hljs.getLanguage(lang) ? lang : 'plaintext';
		return hljs.highlight(code, { language }).value;
	},
	langPrefix: 'hljs language-',
	pedantic: false,
	gfm: true,
	breaks: false,
	sanitize: false,
	smartypants: false,
	xhtml: false
});

function ParseMarkdown(markdownText) {
	return marked.parse(
		markdownText.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,"") // Remove Funny Characters The Some Editors Add
	)
}

function EnsureDir(dir) {
	if (!fs.existsSync(dir)){
		fs.mkdirSync(dir, { recursive: true });
	}
}

function RenderToDirectory(outputDir, inputDir) {
	EnsureDir(outputDir)
	let files = fs.readdirSync(inputDir);
	let outputFiles = [];
	let indexFile = null;
	files.forEach(function(filename) {
		if (filename == "+index.md") {
			indexFile = path.join(inputDir, filename);
			return;
		}
		if (fs.lstatSync(path.join(inputDir, filename)).isDirectory()) {
			fs.mkdirSync(path.join(outputDir, filename), { recursive: true });
			let newFiles = RenderToDirectory(path.join(outputDir, filename), path.join(inputDir, filename));
			outputFiles.push(newFiles);
			return;
		}

		let filePath = path.join(inputDir, filename);
		console.log(`Rendering: ${filePath}`);

		let fileContent = fs.readFileSync(filePath, { encoding: "utf-8" });
		let fileMeta = matter(fileContent);
		if (fileMeta.isEmpty || !fileMeta.data.title) {
			fileMeta.data.title = path.parse(filename).name.replace(/\-/g, ' ');
		}

		let fileConverted = `<!DOCTYPE html>
<html lang="en-US">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="icon" type="image/png" href="https://csprite.github.io/assets/favicon.png" />
	<title>${fileMeta.data.title} - csprite</title>
	<link rel="stylesheet" type="text/css" href="https://csprite.github.io/assets/css/normalize.css">
	<link rel="stylesheet" type="text/css" href="https://csprite.github.io/assets/css/simple.css">
	<link rel="stylesheet" type="text/css" href="https://csprite.github.io/assets/css/post.css">
	<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/base16/windows-10.min.css">
	<!--link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github-dark.min.css"-->
	<script src="https://csprite.github.io/assets/js/scale.fix.js"></script>
</head>
<body>

<div id="MainContainer">${ParseMarkdown(fileMeta.content)}</div>
<footer>
	<nav>
		<a style="display: inline-block; text-align: justify;" href="/">Home</a> |
		<a style="display: inline-block; text-align: justify;" href="/blog/">Blog</a> |
		<a style="display: inline-block; text-align: justify;" href="/wiki/">Wiki</a> |
		<a style="display: inline-block; text-align: justify;" href="https://github.com/pegvin/csprite">GitHub</a>
	</nav>
</footer>

</body>
</html>`;
		let outputFile = path.join(outputDir, path.parse(filename).name + ".html");
		fs.writeFileSync(outputFile, fileConverted, { encoding: "utf-8" });
		outputFiles.push({ html: outputFile, md: path.join(inputDir, filename) });
	});

	return {
		input: indexFile,
		output: path.join(outputDir, "index.html"),
		files: outputFiles
	};
}

function RenderToIndexFile(inputFile, outputFile, filesArr) {
	let fileMeta = matter(fs.readFileSync(inputFile, { encoding: "utf-8" }));
	if (fileMeta.isEmpty || !fileMeta.data.title) {
		fileMeta.data.title = path.parse(inputFile).name.replace(/\-/g, ' ');
	}

	let outputHtml = `<!DOCTYPE html>
<html lang="en-US">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="icon" type="image/png" href="https://csprite.github.io/assets/favicon.png" />
	<title>${fileMeta.data.title}</title>
	<link rel="stylesheet" type="text/css" href="https://csprite.github.io/assets/css/normalize.css">
	<link rel="stylesheet" type="text/css" href="https://csprite.github.io/assets/css/simple.css">
	<link rel="stylesheet" type="text/css" href="https://csprite.github.io/assets/css/post.css">
	<script src="https://csprite.github.io/assets/js/scale.fix.js"></script>
</head>
<body>

<div id="MainContainer">
	${ParseMarkdown(fileMeta.content)}
	<ul>\n`;

	filesArr.forEach(function(file) {
		let _fileMeta = matter(fs.readFileSync(file.md, { encoding: "utf-8" }));
		if (_fileMeta.isEmpty || (!_fileMeta.data.title && !_fileMeta.data.indexTitle)) {
			_fileMeta.data.title = path.parse(file.md).name.replace(/\-/g, ' ');
		}
		outputHtml += `\t\t<li><a href="${path.relative(path.dirname(outputFile), file.html)}">${!_fileMeta.data.indexTitle ? _fileMeta.data.title : _fileMeta.data.indexTitle}</a></li>\n`;
	});

	outputHtml += `\t</ul>
</div>
<footer>
	<nav>
		<a style="display: inline-block; text-align: justify;" href="/">Home</a> |
		<a style="display: inline-block; text-align: justify;" href="/blog/">Blog</a> |
		<a style="display: inline-block; text-align: justify;" href="/wiki/">Wiki</a> |
		<a style="display: inline-block; text-align: justify;" href="https://github.com/pegvin/csprite">GitHub</a>
	</nav>
</footer>

</body>
</html>`

	fs.writeFileSync(outputFile, outputHtml, { encoding: "utf-8" });
}

function RenderIndexFileArr(input, output, files) {
	if ((input != null && output != null)) {
		let indexedFiles = [];
		files.forEach(function(file) {
			if (file.md && file.html) {
				indexedFiles.push(file);
			} else {
				if (file.input == null) {
					indexedFiles.push(...file.files);
				} else {
					indexedFiles.push({ html: file.output, md: file.input });
					RenderIndexFileArr(file.input, file.output, file.files);
				}
			}
		});
		// console.log(`File: ${output}`);
		// console.log(indexedFiles);
		RenderToIndexFile(input, output, indexedFiles);
	}
}

[
	{ input: "./content/", output: "./dist" }
].forEach(function(dirObj) {
	fs.rmSync(dirObj.output, { recursive: true, force: true });
	let filesToIndex = RenderToDirectory(dirObj.output, dirObj.input);
	RenderIndexFileArr(filesToIndex.input, filesToIndex.output, filesToIndex.files);
});
