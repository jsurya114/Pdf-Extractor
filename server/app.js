import express from 'express'
import cors from 'cors'


const app = express()


app.use(cors())
app.use(express.json())
app.use('/api/pdf')

app.use((err,req,res,next)=>{
    console.error('Unhandled error:',err)

    if(err.code==='LIMIT_FILE_SIZE'){
        return res.status(413).json({error:'File is too large',message:'Maximum file size is 50MB'})
    }
if (err.message === 'Only PDF files are allowed') {
    return res.status(400).json({ error: 'Invalid file type', message: err.message });
  }
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });

})

export default app