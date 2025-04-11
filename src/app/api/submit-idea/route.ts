import { NextResponse } from 'next/server';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Define the path for storing data
const DATA_DIR = path.join(process.cwd(), 'src', 'app', 'submit-idea', 'data');
const JSON_FILE_PATH = path.join(process.cwd(), 'src', 'app', 'submit-idea', 'submissions.json');

// Interface for submission data
interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  description: string;
  files: string[];
  submittedAt: string;
}

export async function POST(request: Request) {
  try {
    // Ensure the data directory exists
    if (!existsSync(DATA_DIR)) {
      await mkdir(DATA_DIR, { recursive: true });
    }

    // Parse the form data
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const country = formData.get('country') as string;
    const description = formData.get('description') as string;
    
    // Generate a unique ID for this submission
    const submissionId = uuidv4();
    const uploadedFilePaths: string[] = [];
    
    // Process files if present
    const files = formData.getAll('files');
    if (files && files.length > 0) {
      // Create a folder for this submission's files
      const submissionDir = path.join(DATA_DIR, submissionId);
      await mkdir(submissionDir, { recursive: true });
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i] as File;
        if (!file || typeof file === 'string') continue;
        
        // Generate a safe filename
        const fileExtension = file.name.split('.').pop();
        const safeFileName = `file_${i + 1}_${Date.now()}.${fileExtension}`;
        const filePath = path.join(submissionDir, safeFileName);
        
        // Save the file
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(filePath, buffer);
        
        // Store the relative path for JSON
        uploadedFilePaths.push(`data/${submissionId}/${safeFileName}`);
      }
    }
    
    // Create the submission object
    const submission: Submission = {
      id: submissionId,
      name,
      email,
      phone,
      country,
      description,
      files: uploadedFilePaths,
      submittedAt: new Date().toISOString(),
    };
    
    // Load existing submissions or create new array
    let submissions: Submission[] = [];
    try {
      if (existsSync(JSON_FILE_PATH)) {
        const fileContent = await readFile(JSON_FILE_PATH, 'utf8');
        submissions = JSON.parse(fileContent);
      }
    } catch (error) {
      console.error('Error reading submissions file:', error);
      // Continue with empty array if file doesn't exist or is corrupted
    }
    
    // Add the new submission and write back to the file
    submissions.push(submission);
    await writeFile(JSON_FILE_PATH, JSON.stringify(submissions, null, 2));
    
    return NextResponse.json({ success: true, submissionId });
    
  } catch (error) {
    console.error('Error processing submission:', error);
    return NextResponse.json({ error: 'Failed to process submission' }, { status: 500 });
  }
}
