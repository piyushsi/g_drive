# G_Drive implementation

## Quick Start

Install dependencies:

```bash
$ npm install
```

Start the server:

```bash
$ npm start
```

View the website at: http://localhost:3000

## API endpoints

Size a folder:
required params: id

```bash
post: /api/v1/size
```

Search by filename:
required params: name

```bash
post: /api/v1/search
```

Search by filename:
required params: name

```bash
post: /api/v1/search
```

Search for files with name “File1” and format = PNG:
required params: name,format

```bash
post: /api/v1/find
```

Get list of all files reverse sorted by date:

```bash
get: /api/v1/sort
```
