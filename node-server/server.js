const express = require('express');// Import the Express.js module, a web framework for Node.js
const mysql = require('mysql2');// Import the MySQL2 module to interact with a MySQL database
const cors=require('cors');// Import the CORS (Cross-Origin Resource Sharing) module to allow requests from different origins
const nodemailer = require('nodemailer');// Import the Nodemailer module to send emails from Node.js
const bodyParser=require('body-parser');// Import the body-parser module to parse incoming request bodies
const app =express();// Create an instance of an Express application

////////////////////////////////////

const multer = require('multer');
const path = require('path');
/////////////////////////////////

app.use(express.json());// Use the JSON parser middleware from Express
app.use(bodyParser.json());// Use body-parser to parse JSON-formatted request bodies
app.use(bodyParser.urlencoded({ extended: true }));// Use body-parser to parse URL-encoded request bodies
const session = require('express-session');// Import the express-session module to manage session data
const cookieParser = require('cookie-parser');// Import the cookie-parser module to parse cookies attached to the client request object


app.use(cors());// Use CORS middleware to enable CORS with various options

const server = app.listen(3001);// Start the server and listen on port 3001
server.maxHttpHeaderSize = 65536;// Set the maximum size of HTTP headers to 65536 bytes


// Handle errors related to large request headers
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    res.status(431).json({ error: 'Request Header Fields Too Large' });
  }
});

//Connecting to database in mysql
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Shraddha@123',
  database: 'react_database'
});

app.get('/data', (req, res) => {
  res.json({ message: 'Hello from Node.js!' });
});

let temporaryData = [];//Storing the data of registerpage 
function clearTemporaryData() {
  temporaryData = [];
}



// Extract data from the request body
app.post('/register', (req, res) => {
  const {id, email, phoneNo, password ,name} = req.body;//requesting data from front end
  if (id == null) {
    console.error('IJST ID is null or undefined');
    return res.status(400).json({ error: 'User ID is required' });
  }
 //Check if the email and phonenumber already exists
    db.query('SELECT * FROM users WHERE email = ? OR phoneNo = ?', [email, phoneNo], (error, results) => {
      if (error) {
        console.error('Error checking existing user:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    
      if (results.length > 0) {
        const existingEmail = results.find(user => user.email === email);
        const existingPhoneNo = results.find(user => user.phoneNo === phoneNo);
    
        if (existingEmail) {
          return res.status(300).json({ error: 'Email already exists' });
        }
    
        else if (existingPhoneNo) {
          return res.status(400).json({ error: 'Phone number already exists' });
        }
      }
    // creating transporter using nodemailer to send mail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your email should write here ',
       pass: 'your-app-password-here'
   
     }
  });
  
  // Function to generate random verification code
  function generateVerificationCode() {
    // Generate a 6-digit random code
    return Math.floor(100000 + Math.random() * 900000);
  }
  
  // Function to send verification email
  function sendVerificationEmail(email) {
    const verificationCode = generateVerificationCode();
  
    // Email content
    const mailOptions = {
      from: 'your email should write here ',
      to: email,
      subject: 'Email Verification',
      text:` Your verification code is: ${verificationCode}`// sending verification code
    };
  
    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending verification email:', error);
      } else {
        console.log('Verification email sent:', info.response);
      }
    });
  
    return verificationCode;
  }
  
  const userEmailAddress = email; 
  const verificationCode = sendVerificationEmail(userEmailAddress);
  console.log('Verification code:', verificationCode);
  
  temporaryData.push({id,email, phoneNo, password ,name, verificationCode});//Store the id,email, phoneNo, password ,name and verificationCode in temporaryData
  res.sendStatus(200);
  console.log(temporaryData);
});
});

  // Execute the query for verifying email token
  app.post('/verify', (req, res) => { 
        const { email, token } = req.body;//requesting data from front end
        console.log('Verification email received:', email); // Log received email
        console.log('Verification code received:', token); // Log received verification code
        const user = temporaryData.find(item => item.email === email);

    // Check if user exists
    if (!user) {
        console.error('User not found for email:', email);
        return res.status(400).json({ error: 'User not found for email' });
    }
    console.log('Found user:', user);
    //Checking if the user enterd token matches with the token sent
    if (user.verificationCode.toString() === token.toString()) {
          console.log("Token exists!"); 
          const { id, email, phoneNo, password,name} = user;
          console.log(user);
          //Inserting data to table called users
        const sql = 'INSERT INTO users (IJST_ID, email, phoneNo, password, name) VALUES (?, ?, ?, ?, ?)';
        db.query(sql, [id, email, phoneNo, password, name], (err, result) => {
            if (err) {
                console.error('Error inserting data into database:', err);
                return res.status(500).json({ error: 'Error inserting data into database' });
            }
            console.log('Data inserted into database successfully');
            const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
               user: 'your email should write here ',
               pass: 'your-app-password-here'
              }
            });
            function sendEmail(email, name, id, password) {
              // Email content
              const mailOptions = {
                from: 'your email should write here ',
                to: email,
                subject: 'Welcome to our website',
                text:` Hello ${name},\n\nYour UserID: ${id}\nYour Password: ${password}`//sending name, id and password through email
              };
            
              // Send email
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.error('Error sending email:', error);
                } else {
                  console.log('Email sent:', info.response);
                }
              });
            }
            sendEmail(user.email, user.name, user.id, user.password);
            setTimeout(clearTemporaryData, 3600);//clear the data stored in TemporaryData after inserting it to database
            return res.status(200).json({ message: 'Verification successful.' });
          });
      } else {
      //   // Verification failed
      console.error('Verification code incorrect or not found');
         return res.status(400).json({ error: 'Verification code incorrect.' });
      }
  });

//To edit email
  app.post('/change-email', (req, res) => {
    const {id, email, phoneNo, password ,name} = req.body;//requesting data from front end

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your email should write here ', // Your Gmail email address
                 pass: 'acei smdv pcfs ppej' // Your Gmail password
      }
    });
    
    // Function to generate random verification code
    function generateVerificationCode() {
      // Generate a 6-digit random code
      return Math.floor(100000 + Math.random() * 900000);
    }
    
    // Function to send verification email
    function sendVerificationEmail(email) {
      const verificationCode = generateVerificationCode();
    
      // Email content
      const mailOptions = {
        from: 'your email should write here ',
        to: email,
        subject: 'Email Verification',
        text: `Your verification code is: ${verificationCode}`//sending the verification code to new email
      };
    
      // Send email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending verification email:', error);
        } else {
          console.log('Verification email sent:', info.response);
          return res.status(200).json({ message: 'Verification sent' });
        }
      });
    
      return verificationCode;
    }
    const userEmailAddress = email; 
    const verificationCode = sendVerificationEmail(userEmailAddress);
    console.log('Verification code:', verificationCode);
    temporaryData.push({id,email, phoneNo, password ,name,verificationCode});//Adding data to the temporarydata
    console.log('Temporary data after pushing:', temporaryData);
    res.sendStatus(200);
  });


app.use(cookieParser());// Middleware to parse cookies
app.use(session({ // Middleware for managing sessions
secret:'secret',// Secret used to sign the session ID cookie
resave:false,  // Whether to save the session even if it hasn't been modified
saveUninitialized:false,// Whether to save sessions that are new but not modified
cookie:{
  secure:false, // Whether the cookie should be sent only over HTTPS
  maxAge:1000*60*60*24, // Maximum age of the session cookie in milliseconds
}
}))


app.get('/',(req,res)=>{
  if(req.session.userid){  // Checking if a session variable 'userid' exists
    return res.json({valid:true,userid:req.session.userid})
  }else{
    return res.json({valid:false})
  }
})


// Handle POST request to '/login' endpoint


app.post('/login', (req, res) => {
  const { logid, logpassword } = req.body;//requesting data from front end
  if (!logid || !logpassword) {
    return res.status(400).json({ error: 'User ID and password are required' });
  }
// SQL query to select user from database based on IJST_ID (assuming it's a user identifier) and password
  const query = "SELECT * FROM users WHERE IJST_ID=? AND password=?";
  db.query(query, [logid, logpassword], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json('Internal Server Error');
    }

    if (results.length > 0) {
      const roleStatusQuery = "SELECT role_status FROM user_requests WHERE IJST_ID = ?";
      // SQL query to fetch role_status from user_requests table based on IJST_ID
      db.query(roleStatusQuery, [logid], (statusError, statusResults) => {
        if (statusError) {
          console.error(statusError);
          return res.status(500).json('Internal Server Error');
        }

        if (statusResults.length > 0) {
          const roleStatus = statusResults[0].role_status;
           // Checking if the role status is 'Deactivated'
          if (roleStatus === 'Deactivated') {
            return res.status(403).json('Account is Deactivated');
          } else {
            req.session.userid = results[0].IJST_ID;
            console.log(req.session.userid);
              // If role status is not 'Deactivated', set userid in session and return 200 OK with a success message
            return res.status(200).json({ Login: true, message: 'Login successful!' });
          }
        } else {
           // If no role status results are found, still set userid in session and return 200 OK with a success message
          req.session.userid = results[0].IJST_ID;
          console.log(req.session.userid);
          return res.status(200).json({ Login: true, message: 'Login successful!' });
        }
      });
    } else {
       // If no results are returned from the initial user query, return 401 Unauthorized with an error message
      return res.status(401).json({ error: 'Login failed' });
    }
  });
});


// Define your endpoint to fetch the logged-in user ID
app.get('/getLoggedInUserId', (req, res) => {
  if (req.session.userid) {
    res.status(200).json({ userid: req.session.userid });
  } else {
    res.status(401).json({ error: 'User is not logged in' });
  }
});



//---------------------------------------------------------------------------------------------------------------------//

const storages = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = '';
    if (file.fieldname === 'image') {
      uploadPath = './public/uploads/image/';
    } else if (file.fieldname === 'video') {
      uploadPath = './public/uploads/video/';
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const uploads = multer({
  storage: storages,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "image" || file.fieldname === "video") {
      cb(null, true);
    } else {
      cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
    }
  }
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]);




// Get all courses
app.get('/courses', (req, res) => {
  const sql = 'SELECT * FROM courses';
  db.query(sql, (error, results) => {
    if (error) {
      console.error('Error fetching courses:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(200).json(results);
  });
});





///--------------------------------------------------------------Course page-----------------------------------------/////


//10-7-24 working
app.get('/course-details/:course_id', (req, res) => {
  const courseId = req.params.course_id;
  const sql = 'SELECT * FROM courses WHERE course_id = ?';
  db.query(sql, [courseId], (error, result) => {
    if (error) {
      console.error('Error fetching course details:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Check if the user has already enrolled
    const userId = req.userid; // Assuming you have user ID in req.user after authentication
    console.log(req.userid)
    const checkEnrollmentSql = 'SELECT * FROM EnrolledCourse WHERE user_id = ? AND course_id = ?';
    db.query(checkEnrollmentSql, [userId, courseId], (err, enrollmentResult) => {
      if (err) {
        console.error('Error checking enrollment:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      const isEnrolled = enrollmentResult.length > 0;
      res.status(200).json({ ...result[0], isEnrolled }); // Send isEnrolled state to frontend
    });
  });
});

app.get('/check-enrollment/:course_id/:user_id', (req, res) => {
  const { course_id, user_id } = req.params;
  const query = 'SELECT COUNT(*) as count FROM enrolledcourse WHERE course_id = ? AND user_id = ?';

  db.query(query, [course_id, user_id], (err, results) => {
    if (err) {
      console.error('Error checking enrollment:', err);
      return res.status(500).json({ error: 'Failed to check enrollment' });
    }

    const isEnrolled = results[0].count > 0;
    res.json({ isEnrolled });
  });
});


///--------------------------------------------------------------Course page-----------------------------------------/////



///--------------------------------------------------------------Code for Creating course---------------------------------------////




app.use('/public', express.static(path.join(__dirname, 'public')));

// API endpoint to create a course
app.post('/courses', uploads, (req, res) => {
  const { title, description, price, duration, instructor_id,learningPoints } = req.body;
  const imageFile = req.files['image'];
  const videoFile = req.files['video'];

  if (!title || !description || !price || !duration || !imageFile || !videoFile || !instructor_id || !learningPoints) {
    return res.status(400).json({ error: 'All fields and files are required' });
  }

  const imageUrl = imageFile ? '/public/uploads/image/' + imageFile[0].filename : null;
  const videoUrl = videoFile ? '/public/uploads/video/' + videoFile[0].filename : null;

  const sql = 'INSERT INTO courses (title, description, instructor_id, price, duration, image_url, video_url, learning_points) VALUES (?, ?, ?, ?, ?, ?, ?,?)';
  const values = [title, description, instructor_id, price, duration, imageUrl, videoUrl,learningPoints];

  db.query(sql, values, (error, result) => {
    if (error) {
      console.error('Error creating course:', error);
      return res.status(500).json({ error: 'Error creating course' });
    }

    const fetchSubscribersSql = 'SELECT email FROM subscribers';
    db.query(fetchSubscribersSql, (err, subscribers) => {
      if (err) {
        console.error('Error fetching subscribers:', err);
        return res.status(500).json({ error: 'Error fetching subscribers' });
      }

      subscribers.forEach(subscriber => {
        sendNewCourseEmail(subscriber.email, title);
      });
      const courseId = result.insertId; // Ensure this is correctly set
    console.log('Course created with ID:', courseId); // Log the courseId to confirm 
      res.status(201).json({ message: 'Course created successfully and emails sent', courseId });
    });
  });
});

// Function to send email about the new course
const sendNewCourseEmail = (email, courseTitle) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
       user: 'your email should write here ',
               pass: 'your-app-password-here'
    }
  });

  const mailOptions = {
    from: 'your email should write here ',
    to: email,
    subject: `New Course Added: ${courseTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f4f4;">
        <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
          <h1 style="color: #2e6da4;">Dear Learner,</h1>
          <p style="font-size: 16px; line-height: 1.5;">We are thrilled to announce that we have added a brand-new course to our website: <strong>${courseTitle}</strong>. Whether you're looking to expand your knowledge or boost your career, this course offers valuable insights and practical skills that you won't want to miss.</p>
          <ul style="font-size: 16px; line-height: 1.5;">
            <li><strong>Comprehensive Content:</strong> Gain in-depth knowledge on [Key Topic].</li>
            <li><strong>Expert Instructors:</strong> Learn from industry leaders with years of experience.</li>
            <li><strong>Flexible Learning:</strong> Access the course anytime, anywhere at your own pace.</li>
          </ul>
          <div style="margin-top: 20px;">
            <a href="http://localhost:3002/coursePage/${encodeURIComponent(courseTitle.replace(/\s+/g, '-').toLowerCase())}" style="background-color: #2e6da4; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Enroll Now</a>
          </div>
          <p style="font-size: 16px; margin-top: 20px;">Thank you for being a part of our community. We look forward to seeing you in class!</p>
        </div>
      </div>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('New course email sent:', info.response);
    }
  });
};

// API endpoint to fetch course details by title
app.get('/coursePage/:courseTitle', (req, res) => {
  const courseTitle = decodeURIComponent(req.params.courseTitle.replace(/-/g, ' '));

  const sql = 'SELECT * FROM courses WHERE title = ?';
  db.query(sql, [courseTitle], (error, results) => {
    if (error) {
      console.error('Error fetching course details:', error);
      return res.status(500).json({ error: 'Error fetching course details' });
    }
    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  });
});

let cart = [];

app.post('/api/cart', (req, res) => {
  cart = [...cart, ...req.body];
  res.status(200).json({ message: 'Items added to cart successfully' });
});




// Endpoint to fetch related courses based on title similarity
app.get('/api/courses/related/:courseId', (req, res) => {
  const { courseId } = req.params;

  // Step 1: Fetch the title based on courseId
  const fetchTitleQuery = `SELECT title FROM courses WHERE course_id = ?`;

  db.query(fetchTitleQuery, [courseId], (err, titleResult) => {
    if (err) {
      console.error('Error fetching course title:', err);
      return res.status(500).json({ error: 'Error fetching course title' });
    }

    if (titleResult.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const courseTitle = titleResult[0].title;

    // Step 2: Split the title into words to use for searching similar courses
    const titleWords = courseTitle.split(' ').filter(word => word.length > 2);

    if (titleWords.length === 0) {
      return res.status(404).json({ error: 'No related courses found based on the title' });
    }

    // Create a search query using LIKE operators for each word in the title
    const searchConditions = titleWords.map(word => `title LIKE ?`).join(' OR ');
    const searchValues = titleWords.map(word => `%${word}%`);

    // Step 3: Fetch related courses based on similar words in the title
    const fetchRelatedCoursesQuery = `
      SELECT * FROM courses 
      WHERE course_id != ? AND (${searchConditions})
      LIMIT 2
    `;

    db.query(fetchRelatedCoursesQuery, [courseId, ...searchValues], (err, relatedResults) => {
      if (err) {
        console.error('Error fetching related courses:', err);
        return res.status(500).json({ error: 'Error fetching related courses' });
      }

      if (relatedResults.length === 0) {
        return res.status(404).json({ error: 'No related courses found' });
      }

      res.json(relatedResults);
    });
  });
});




app.get('/emailcourse-data/:courseTitle', (req, res) => {
  const courseTitle = req.params.courseTitle;
  console.log('courseTitle:', courseTitle);
  
    // Query to get chapters and topics based on course_title
    const chapterQuery = 'SELECT chapter_name, topic_name,topic_type FROM chapters WHERE course_title = ?';

    db.query(chapterQuery, [courseTitle], (err, chapterResults) => {
      if (err) {
        console.error('Error querying chapters:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Structure to separate chapters and their topics
      const chapters = {};
      
      chapterResults.forEach(result => {
        const { chapter_name, topic_name, topic_type } = result;

        if (!chapters[chapter_name]) {
          chapters[chapter_name] = [];
        }
        chapters[chapter_name].push({ name: topic_name, type: topic_type });
      });

      // Prepare the response
      return res.status(200).json({
        chapters,
      });
    });
  });





///--------------------------------------------------------------End of Code for Creating course---------------------------------------////

///--------------------------------------------------------------course chapters---------------------------------------////




app.get('/course-data/:courseId', (req, res) => {
  const courseId = req.params.courseId;
  console.log('courseId:', courseId);
  if (!courseId) {
    return res.status(400).json({ error: 'Course ID is required' });
  }

  // Query to get course_title and image_url from courses table
  const courseQuery = 'SELECT title, image_url FROM courses WHERE course_id = ?';

  db.query(courseQuery, [courseId], (err, courseResults) => {
    if (err) {
      console.error('Error querying courses:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (courseResults.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const { title, image_url } = courseResults[0];

    // Query to get chapters and topics based on course_title
    const chapterQuery = 'SELECT chapter_name, topic_name,topic_type,file_path, link FROM chapters WHERE course_title = ?';

    db.query(chapterQuery, [title], (err, chapterResults) => {
      if (err) {
        console.error('Error querying chapters:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Structure to separate chapters and their topics
      const chapters = {};
      
      chapterResults.forEach(result => {
        const { chapter_name, topic_name, topic_type,file_path, link } = result;

        if (!chapters[chapter_name]) {
          chapters[chapter_name] = [];
        }
        chapters[chapter_name].push({ name: topic_name, type: topic_type ,file:file_path,link});
      });

      // Prepare the response
      return res.status(200).json({
        title,
        image_url,
        chapters,
      });
    });
  });
});








app.use('/upload-topic', express.static(path.join(__dirname, 'public', 'uploads', 'chapter')));
app.use('/uploads', express.static('uploads'));

const chstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public', 'uploads', 'chapter')); 
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const chupload = multer({ storage: chstorage });

app.post('/upload-topic', chupload.single('file'), (req, res) => {
  const { course_title, image_url, chapter_name, topic_name, topic_type,vedio_type,link,live_type } = req.body;
  const filePath = req.file ? path.join('/public/uploads/chapter', req.file.filename).replace(/\\/g, '/'): null;

  const query = `
    INSERT INTO chapters (course_title, image_url, chapter_name, topic_name, topic_type,file_path,vedio_type,link,live_type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [course_title, image_url, chapter_name, topic_name, topic_type,filePath,vedio_type,link,live_type], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('Failed to upload topic');
      return;
    }

    res.status(200).send('Topic uploaded successfully');
    console.log(result);
  });
});






app.post('/upload/topicdetails',chupload.none(), (req, res) => {
  const { chapter_name, course_title, topic_name, tags, duration, description } = req.body;
console.log(chapter_name, course_title, topic_name, tags, duration, description);
  const sqlQuery = `
    UPDATE chapters
    SET tags = ?, duration = ?, description = ?
    WHERE course_title = ? AND chapter_name = ? AND topic_name = ?
  `;

  db.query(sqlQuery, [tags, duration, description, course_title, chapter_name, topic_name], (err, result) => {
    if (err) {
      console.error('Error updating chapter:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Chapter details updated successfully' });
    } else {
      res.status(404).json({ message: 'Chapter not found' });
    }
  });
});



app.post('/upload/quiz', chupload.single('file'), (req, res) => {
  const { chapter_name, course_title, topic_name, tags, duration, no_retake } = req.body;
  console.log(chapter_name, course_title, topic_name, tags, duration, no_retake );
  const file_path = req.file ? req.file.path : null;

  const sqlQuery = `
    UPDATE chapters
    SET tags = ?, duration = ?, no_retake = ?, file_path = ?
    WHERE course_title = ? AND chapter_name = ? AND topic_name = ?
  `;

  // Execute the query with the provided data
  db.query(sqlQuery, [tags, duration, no_retake, file_path, course_title, chapter_name, topic_name], (err, result) => {
    if (err) {
      console.error('Error updating quiz data:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Quiz data updated successfully' });
    } else {
      res.status(404).json({ message: 'Quiz not found' });
    }
  });
});



app.post('/api/live', (req, res) => {
  const { chapter_name, course_title, topic_name, tags, available_from, available_till, Link} = req.body;

  const sqlQuery = `
    UPDATE chapters
    SET tags = ?, available_from = ?, available_till = ?, link = ?
    WHERE course_title = ? AND chapter_name = ? AND topic_name = ?
  `;


  // Execute the query with the provided data
  db.query(sqlQuery, [
    tags, 
    available_from, 
    available_till, 
    Link, 
    course_title, 
    chapter_name, 
    topic_name
  ], (err, result) => {
    if (err) {
      console.error('Error updating chapter data:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Data updated successfully' });
    } else {
      res.status(404).json({ message: 'Chapter not found' });
    }
  });
});


app.post('/api/forms', (req, res) => {
  const { chapterName, title, topicName, tags, availability, fromDate, tillDate, formFields } = req.body;

  // Convert formFields to a JSON string if it's an object
  const formFieldsJson = typeof formFields === 'object' ? JSON.stringify(formFields) : formFields;

  // Define the SQL query to update the relevant fields
  const sqlQuery = `
    UPDATE chapters
    SET tags = ?, availability = ?, available_from = ?, available_till = ?, form_builder = ?
    WHERE course_title = ? AND chapter_name = ? AND topic_name = ?
  `;

  // Execute the query with the provided data
  db.query(sqlQuery, [
    tags, 
    availability, 
    fromDate, 
    tillDate, 
    formFieldsJson, // Pass the JSON string here
    title, 
    chapterName, 
    topicName
  ], (err, result) => {
    if (err) {
      console.error('Error updating form data:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Form data updated successfully' });
    } else {
      res.status(404).json({ message: 'Record not found' });
    }
  });
});




app.post('/api/assignment', (req, res) => {
  const { chapterName, title, topic, availability, fromDate, tillDate } = req.body;

  const sqlQuery = `
    UPDATE chapters
    SET availability = ?, available_from = ?, available_till = ?
    WHERE course_title = ? AND chapter_name = ? AND topic_name = ?
  `;

  // Execute the query with the provided data
  db.query(sqlQuery, [
    availability, 
    fromDate, 
    tillDate, 
    title, 
    chapterName, 
    topic
  ], (err, result) => {
    if (err) {
      console.error('Error updating assignment data:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Form data updated successfully' });
    } else {
      res.status(404).json({ message: 'Record not found' });
    }
  });
});



///--------------------------------------------------------------course chapters---------------------------------------////







///--------------------------------------------------------------Code for updating course---------------------------------------////

app.get('/courses/:instructor_id', (req, res) => {
  const instructorId = req.params.instructor_id;

  const sql = 'SELECT * FROM courses WHERE instructor_id = ?';
  db.query(sql, [instructorId], (error, results) => {
    if (error) {
      console.error('Error fetching courses:', error);
      return res.status(500).json({ error: 'Error fetching courses' });
    }
    res.status(200).json(results);
  });
});

app.put('/courses/:course_id', uploads, (req, res) => {
  const { course_id } = req.params;
  const { title, description, price, duration } = req.body;
  const imageFile = req.files['image'];
  const videoFile = req.files['video'];

  // Process image and video uploads
  const imageUrl = imageFile ? '/public/uploads/image/' + imageFile[0].filename : null;
  const videoUrl = videoFile ? '/public/uploads/video/' + videoFile[0].filename : null;

  const sql = `UPDATE courses 
               SET title = ?, description = ?, price = ?, duration = ?, image_url = COALESCE(?, image_url), video_url = COALESCE(?, video_url) 
               WHERE course_id = ?`;
  const values = [title, description, price, duration, imageUrl, videoUrl, course_id];

  db.query(sql, values, (error, result) => {
    if (error) {
      console.error('Error updating course:', error);
      return res.status(500).json({ error: 'Error updating course' });
    }
    res.status(200).json({ message: 'Course updated successfully' });
  });
});

///--------------------------------------------------------------End of update course---------------------------------------////


///---------------------------------S----------------------------- delete course---------------------------------------////
app.delete('/courses/:course_id/:instructor_id', (req, res) => {
  const { course_id, instructor_id } = req.params;

  const sql = 'DELETE FROM courses WHERE course_id = ? AND instructor_id = ?';
  db.query(sql, [course_id, instructor_id], (error, result) => {
    if (error) {
      console.error('Error deleting course:', error);
      return res.status(500).json({ error: 'Error deleting course' });
    }
    res.status(200).json({ message: 'Course deleted successfully' });
  });
});


///--------------------------------------------------------------delete course---------------------------------------////

//----------------------------------------------------------------Enroll course--------------------------------------//
// Enroll in a course
// Endpoint to enroll in a course
app.post('/enroll-course', (req, res) => {
  const { user_id, course_id } = req.body;

  // Check if user_id and course_id are provided
  if (!user_id || !course_id) {
    return res.status(400).json({ error: 'Missing user_id or course_id' });
  }

  // Check if the user is already enrolled in the course
  const checkEnrollmentSql = 'SELECT * FROM enrolledcourse WHERE user_id = ? AND course_id = ?';
  db.query(checkEnrollmentSql, [user_id, course_id], (err, enrollmentResult) => {
    if (err) {
      console.error('Error checking enrollment:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (enrollmentResult.length > 0) {
      return res.status(400).json({ error: 'User is already enrolled in this course' });
    }

    // If not enrolled, proceed with the enrollment
    const enrollCourseSql = 'INSERT INTO enrolledcourse (user_id, course_id) VALUES (?, ?)';
    db.query(enrollCourseSql, [user_id, course_id], (error, result) => {
      if (error) {
        console.error('Error enrolling in course:', error);
        return res.status(500).json({ error: 'Failed to enroll in course' });
      }
      res.status(200).json({ message: 'Enrollment successful' });
    });
  });
});



//-------------------------------- my course display page-------------------------------------------------------
// Get courses enrolled by the logged-in user
app.get('/enrolled-courses/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const sql = `
    SELECT courses.* 
    FROM courses 
    JOIN enrolledcourse ON courses.course_id = enrolledcourse.course_id 
    WHERE enrolledcourse.user_id = ?
  `;
  db.query(sql, [userId], (error, results) => {
    if (error) {
      console.error('Error fetching enrolled courses:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(200).json(results);
  });
});



app.post('/course/:courseId/rate', (req, res) => {
  const { courseId } = req.params;
  const { rating } = req.body;

  // Start a transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error('Error starting transaction:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    // First, check if the course exists
    db.query('SELECT * FROM watch_course WHERE course_id = ?', [courseId], (error, results) => {
      if (error) {
        return db.rollback(() => {
          console.error('Error checking course existence:', error);
          res.status(500).json({ message: 'Server error' });
        });
      }

      if (results.length === 0) {
        // Course does not exist, insert a new record
        db.query('INSERT INTO watch_course (course_id, rating) VALUES (?, ?)', [courseId, rating], (insertError) => {
          if (insertError) {
            return db.rollback(() => {
              console.error('Error inserting new course:', insertError);
              res.status(500).json({ message: 'Server error' });
            });
          }

          // Commit transaction after insert
          db.commit((commitError) => {
            if (commitError) {
              return db.rollback(() => {
                console.error('Error committing transaction after insert:', commitError);
                res.status(500).json({ message: 'Server error' });
              });
            }
            res.status(200).json({ message: 'Course inserted and rating set successfully' });
          });
        });
      } else {
        // Course exists, update the rating
        db.query('UPDATE watch_course SET rating = ? WHERE course_id = ?', [rating, courseId], (updateError) => {
          if (updateError) {
            return db.rollback(() => {
              console.error('Error updating rating:', updateError);
              res.status(500).json({ message: 'Server error' });
            });
          }

          // Commit transaction after update
          db.commit((commitError) => {
            if (commitError) {
              return db.rollback(() => {
                console.error('Error committing transaction after update:', commitError);
                res.status(500).json({ message: 'Server error' });
              });
            }
            res.status(200).json({ message: 'Rating updated successfully' });
          });
        });
      }
    });
  });
});





// Add a comment
app.post('/course/:courseId/comment', (req, res) => {
  const { courseId } = req.params;
  const { comment } = req.body;

  // Insert comment into the table (assuming comments are stored directly in the table)
  db.query(
    'INSERT INTO watch_course (course_id, comments) VALUES (?, ?)',
    [courseId, comment],
    (error, results) => {
      if (error) {
        console.error('Error adding comment:', error);
        return res.status(500).json({ message: 'Server error' });
      }
      res.status(201).json({ id: results.insertId, comment });
    }
  );
});

app.post('/course/:courseId/like', (req, res) => {
  const { courseId } = req.params;
  console.log('Like request received for courseId:', req.params.courseId);

  db.query('UPDATE watch_course SET likes = likes + 1 WHERE course_id = ?', [courseId], (error, results) => {
    if (error) {
      console.error('Error liking course:', error);
      return res.status(500).json({ message: 'Server error' });
    }
    res.status(200).json({ message: 'Course liked successfully' });
    console.log(results);
  });
});


// Send support message
app.post('/course/:courseId/support', (req, res) => {
  const { courseId } = req.params;
  const { instructor_id, subject, message, title } = req.body;
  
  db.query(
    'INSERT INTO watch_course (course_id, instructor_id, subject, message, titles) VALUES (?, ?, ?, ?, ?)',
    [courseId, instructor_id, subject, message, title],
    (error, results) => {
      if (error) {
        console.error('Error sending support message:', error);
        return res.status(500).json({ message: 'Server error' });
      }
      res.status(201).json({ message: 'Support message sent successfully' });
    }
  );
});



//-------------------------------------------------------------------------------------------------------------//






//Checking Role of user
app.get('/role', (req, res) => {
  // Query to select role from the users table
  const selectRoleQuery = 'SELECT role FROM users WHERE  IJST_ID=?';
  const values = [req.session.userid];
  
  // Execute the role query
  db.query(selectRoleQuery, values, (error, results) => {
    if (error) {
      console.error('Error fetching role:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Log the fetched results for debugging
    console.log('Fetched role:', results);

    // Check if any role was found
    if (results.length === 0) {
      console.log('No role found for the user');
      return res.status(404).json({ error: 'No role found' });
    }

    // Extract the role from the results
    const role = results[0].role;

    if (role === 'Website Admin') {
      // If the role is Website Admin, send the role directly
      return res.json({ role: 'Website Admin' });
    } else if (role === 'Admin') {
      // If the role is Admin, query the user_requests table for role_needed
      const selectRoleNeededQuery = 'SELECT role_needed FROM user_requests WHERE  IJST_ID=?';
      
      // Execute the query for role_needed
      db.query(selectRoleNeededQuery, values, (error, roleNeededResults) => {
        if (error) {
          console.error('Error fetching role_needed:', error);
          return res.status(500).json({ error: 'Internal server error' });
        }

        // Log the fetched role_needed results for debugging
        console.log('Fetched role_needed:', roleNeededResults);

        // Check if any role_needed was found
        if (roleNeededResults.length === 0) {
          console.log('No role_needed found for the Admin user');
          return res.status(404).json({ error: 'No role_needed found' });
        }

        // Extract the role_needed from the results
        const role = roleNeededResults[0].role_needed;

        // Send the role and role_needed as JSON response
        res.json({role});
      });
    } else {
      // For any other role, just send the role
      res.json({ role });
    }
  });
});





let userDetail = [];

app.get('/Profile', (req, res) => {
  if (req.session.userid) {
    // Select statement to fetch user details based on username
    const query = "SELECT email, phoneNo, name FROM users WHERE IJST_ID = ?";
    const values = [req.session.userid];
    
    db.query(query, values, (error, results) => {
      if (error) {
        // Handle query execution error
        console.error("Error executing query:", error);
        res.json({ valid: false, message: 'Error fetching user details' });
        return;
      }

      if (results && results.length > 0) {
        // Assuming your query returns an array of objects, grab the first one
        const { email, phoneNo, name } = results[0];
        
        // Push user details to userDetail array
        userDetail.push({ email, phoneNo, name });
        
       // res.json({ valid: true, userid: req.session.userid, userDetail });
       res.json({ valid: true,userDetail });
      } else {
        res.json({ valid: false, message: 'User not found' });
      }
    });
  } else {
    res.json({ valid: false, message: 'User not authenticated' });
  }
});




app.get('/logout', (req, res) => {
  // Destroy the user session
  req.session.destroy((err) => {
      if (err) {
          console.error('Error destroying session:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }
      // Clear session cookies
      res.clearCookie('connect.sid');
      // Send a success response
      res.status(200).json({ message: 'Logout successful' });
  });
});



app.post('/saveprofile', (req, res) => {
  // Extract data from the request body

  const { name,  dobTime, age, phoneNo, email } = req.body;
  const id = req.session.userid;

  // Construct SQL query to insert data into the profile table
  const query = `INSERT INTO profile (IJST_ID, name,dobTime, age, phoneNo, email) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [id, name,  dobTime, age, phoneNo, email];

  // Execute the SQL query
  db.query(query, values, (error, results) => {
    if (error) {
      console.error('Error inserting data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log('Data inserted successfully');
      res.status(200).json({ message: 'Data inserted successfully' });
    }
  });
});




app.post('/saveeducation', (req, res) => {
  // Extract data from the request body

  const {h_schoolName,h_yearOfPassing,h_percentage,pu_collegeName,pu_yearOfPassing,pu_percentage,ug_collegeName , ug_yearOfPassing,ug_percentage,pg_collegeName,pg_yearOfPassing,pg_percentage,phd_institutionName,phd_yearOfPassing,phd_percentage} = req.body;
  const id=req.session.userid;

  // Construct SQL query to insert data into the profile table
  const query = `INSERT INTO education (IJST_ID, h_schoolName,h_yearOfPassing, h_percentage,pu_collegeName, pu_yearOfPassing, pu_percentage,ug_collegeName,ug_yearOfPassing,ug_percentage,pg_collegeName, pg_yearOfPassing,pg_percentage, phd_institutionName, phd_yearOfPassing, phd_percentage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [id,h_schoolName, h_yearOfPassing,h_percentage,pu_collegeName,pu_yearOfPassing,pu_percentage,ug_collegeName ,ug_yearOfPassing,ug_percentage,pg_collegeName,pg_yearOfPassing,pg_percentage,phd_institutionName,phd_yearOfPassing,phd_percentage];
  // Execute the SQL query
  db.query(query, values, (error, results) => {
      if (error) {
          console.error('Error inserting data:', error);
          res.status(500).json({ error: 'Internal Server Error' });
      } else {
          console.log('Data inserted successfully');
          res.status(200).json({ message: 'Data inserted successfully' });
      }
  });
});


app.post('/experience', async (req, res) => {
  const id=req.session.userid;
  const { experienceType, experiences } = req.body;

  // Check for required fields
  if (!experienceType || (experienceType === 'experienced' && !experiences.length)) {
    return res.status(400).json({ message: 'Missing required experience data' });
  }

  let query;
  let values;
  if (experienceType === 'fresher') {
    query = `INSERT INTO Experience (IJST_ID, experience_type) VALUES (?, ?)`;
    values = [id, experienceType]; 
  } else {
    const experienceValues = experiences.map(exp => [id, exp.companyName, exp.joinedDate, exp.resignedDate]);
    query = `INSERT INTO Experience (IJST_ID, company_name, date_of_joining, date_of_resigning) VALUES ?`;
    values = [experienceValues];
  }

  // Execute the SQL query
  db.query(query, values, (error, results) => {
    if (error) {
      console.error('Error inserting experience data:', error);
      // Handle the error here (e.g., log more details or return a specific error code)
      return res.status(500).json({ message: 'An error occurred while submitting experience data' });
    }

    console.log('Experience data submitted successfully');
    res.status(200).json({ message: 'Experience data submitted successfully' });
  });
});





//------------------------------------------------------------------------------------------------------------------------------------------------
//This section of the code is for SubmitPaper.jsx 
//------------------------------------------------------------------------------------------------------------------------------------------------

// PDF store 


app.use("/pulic/files",express.static("files"))

const storage = multer.diskStorage({
  destination: function (req, file, cb) { //useruploading file here
    cb(null, "./public/files");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }

});





// Add this line to serve static files from the 'public' directory
app.use('/public', express.static(path.join(__dirname, 'public')));

const upload = multer({ storage:storage })

// Serve static PDF files from the 'uploads' folder
app.use('/public/files', express.static(path.join(__dirname, 'public/files')));

app.post('/submitPaper', upload.fields([
  { name: 'paperFile', maxCount: 1 },
  { name: 'coverLetterFile', maxCount: 1 },
  { name: 'paperFilePlagiarism', maxCount: 1 }
]), (req, res) => {
   // Ensure that user is authenticated and session contains userid
   if (!req.session.userid) {
    return res.status(401).send("Unauthorized");
  }

  const IJST_ID = req.session.userid;
  const paper_title = req.body.paperTitle;
  const technologies = req.body.selectedTechnology;
  const industries = req.body.selectedIndustries;
  const submission_date = new Date();
  const mla_citation = req.body.mlaCitation;
  const apa_citation = req.body.apaCitation;
  const chicago_citation = req.body.chicagoCitation;
  const harvard_citation = req.body.harvardCitation;
  const vancouver_citation = req.body.vancouverCitation;
  const Reference_mla_citation = req.body.Reference_mla_citation;
  const Reference_apa_citation = req.body.Reference_apa_citation;
  const Reference_chicago_citation = req.body.Reference_chicago_citation;
  const Reference_harvard_citation = req.body.Reference_harvard_citation;
  const Reference_vancouver_citation = req.body.Reference_vancouver_citation;

  if (!req.files || !req.files['paperFile'] || !req.files['coverLetterFile'] || !req.files['paperFilePlagiarism']) {
    console.log("Error: No files uploaded or incorrect field names.");
    return res.status(400).send("Error: No files uploaded or incorrect field names.");
  }

  const paperFilePath = req.files['paperFile'][0].path.replace(/\\/g, '/');
  const coverLetterFilePath = req.files['coverLetterFile'][0].path.replace(/\\/g, '/');
  const paperFilePlagiarismPath = req.files['paperFilePlagiarism'][0].path.replace(/\\/g, '/');

  const paperFileName = req.files['paperFile'][0].filename;
  const coverLetterFileName = req.files['coverLetterFile'][0].filename;
  const paperFilePlagiarismName = req.files['paperFilePlagiarism'][0].filename;

  const values = [
    IJST_ID,
    submission_date,
    paper_title,
    technologies,
    industries,
    coverLetterFileName,
    coverLetterFilePath,
    paperFileName,
    paperFilePath,
    paperFilePlagiarismName,
    paperFilePlagiarismPath,
    mla_citation,
    apa_citation,
    chicago_citation,
    harvard_citation,
    vancouver_citation,
    Reference_mla_citation,
    Reference_apa_citation,
    Reference_chicago_citation,
    Reference_harvard_citation,
    Reference_vancouver_citation
  ];

  const insertQuery = `
    INSERT INTO submitpaper (
      IJST_ID, submission_date, paper_title, technologies, industries, cover_name, cover_path,
      paper_name, paper_path, paper_plagiarism_name, paper_plagiarism_path,
      mla_citation, apa_citation, chicago_citation, harvard_citation, vancouver_citation,
      Reference_mla_citation, Reference_apa_citation, Reference_chicago_citation,
      Reference_harvard_citation, Reference_vancouver_citation
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(insertQuery, values, (error, results, fields) => {
    if (error) {
      console.error("Error inserting data into submitpaper table:", error);
      return res.status(500).send("Error inserting data into submitpaper table.");
    }
    console.log("Data inserted into submitpaper table successfully.");

    // Citation Matching Logic and Recording Citing User
    const citationUpdateQuery = `
      UPDATE submitpaper sp
      SET sp.citations = sp.citations + 1
      WHERE (sp.mla_citation = ? AND ? IS NOT NULL) OR
            (sp.apa_citation = ? AND ? IS NOT NULL) OR
            (sp.chicago_citation = ? AND ? IS NOT NULL) OR
            (sp.harvard_citation = ? AND ? IS NOT NULL) OR
            (sp.vancouver_citation = ? AND ? IS NOT NULL)
    `;

    const citationInsertQuery = `
      INSERT INTO paper_citations (citing_user_id, cited_paper_id, citation_date)
      SELECT ?, sp.pid, ?
      FROM submitpaper sp
      WHERE (sp.mla_citation = ? AND ? IS NOT NULL) OR
            (sp.apa_citation = ? AND ? IS NOT NULL) OR
            (sp.chicago_citation = ? AND ? IS NOT NULL) OR
            (sp.harvard_citation = ? AND ? IS NOT NULL) OR
            (sp.vancouver_citation = ? AND ? IS NOT NULL)
    `;

    const citationUpdateValues = [
      Reference_mla_citation, Reference_mla_citation,
      Reference_apa_citation, Reference_apa_citation,
      Reference_chicago_citation, Reference_chicago_citation,
      Reference_harvard_citation, Reference_harvard_citation,
      Reference_vancouver_citation, Reference_vancouver_citation
    ];

    db.query(citationUpdateQuery, citationUpdateValues, (error, results) => {
      if (error) {
        console.error("Error updating citations:", error);
        return res.status(500).send("Error updating citations.");
      }

      // Insert records into paper_citations table
      db.query(citationInsertQuery, [
        IJST_ID, submission_date,
        Reference_mla_citation, Reference_mla_citation,
        Reference_apa_citation, Reference_apa_citation,
        Reference_chicago_citation, Reference_chicago_citation,
        Reference_harvard_citation, Reference_harvard_citation,
        Reference_vancouver_citation, Reference_vancouver_citation
      ], (error, results) => {
        if (error) {
          console.error("Error inserting data into paper_citations table:", error);
          return res.status(500).send("Error inserting data into paper_citations table.");
        }
        console.log("Citations recorded successfully.");
        res.send('Files uploaded, data inserted, citations updated, and citation records stored successfully.');
      });
    });
  });
});


//------------------------------------------------------------------------------------------------------------------------------------------------
//End of this section code is for SubmitPaper.jsx  
//------------------------------------------------------------------------------------------------------------------------------------------------







//------------------------------------------------------------------------------------------------------------------------------------------------
//This section of the code is for PaperInreview.jsx
//------------------------------------------------------------------------------------------------------------------------------------------------



app.get('/PaperInreview', (req, res) => {
  const selectQuery = `
    SELECT paper_title, paper_name, pid, submission_date, status,
           Reviewer_1_comments, Reviewer_2_comments, user_comments,
           paper_path, Reviewer_1_UserCommen, Reviewer_2_UserCommen
    FROM submitPaper
    WHERE IJST_ID = ?`;
  const values = [req.session.userid];


  db.query(selectQuery, values, (error, results) => {
    if (error) {
      console.error('Error fetching papers:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }


    console.log('Fetched papers:', results);


    if (results.length === 0) {
      console.log('No papers found for the user');
      return res.status(404).json({ error: 'No papers found' });
    }


    res.json(results);
  });
});


app.post('/postComment', (req, res) => {
  const { paperId, userComments } = req.body;

  // const updateQuery = 'UPDATE submitPaper SET user_comments = ? WHERE pid = ?';
  const updateQuery = 'UPDATE submitPaper SET user_comments = ? WHERE pid = ?';


  const values = [userComments, paperId];

  db.query(updateQuery, values, (error, results) => {
    if (error) {
      console.error('Error posting comment:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    console.log('Comment posted successfully');
    res.json({ success: true });
  });
});


app.post('/deleteComment', (req, res) => {
  const { paperId } = req.body;
  db.query('UPDATE submitpaper SET user_comments = NULL WHERE pid = ?', [paperId], (error, results) => {
    if (error) {
      res.status(500).send('Failed to delete comment');
    } else {
      res.send('Comment deleted successfully');
    }
  });
});

app.post('/deleteReviewer1UserComment', (req, res) => {
  const { paperId } = req.body;
  db.query('UPDATE submitpaper SET Reviewer_1_UserCommen = NULL WHERE pid = ?', [paperId], (error, results) => {
    if (error) {
      res.status(500).send('Failed to delete Reviewer 1 user comment');
    } else {
      res.send('Reviewer 1 user comment deleted successfully');
    }
  });
});

app.post('/deleteReviewer2UserComment', (req, res) => {
  const { paperId } = req.body;
  db.query('UPDATE submitpaper SET Reviewer_2_UserCommen = NULL WHERE pid = ?', [paperId], (error, results) => {
    if (error) {
      res.status(500).send('Failed to delete Reviewer 2 user comment');
    } else {
      res.send('Reviewer 2 user comment deleted successfully');
    }
  });
});
app.post('/postReply', (req, res) => {
  const { paperId, reviewer, reply } = req.body;
  const column = reviewer === 'reviewer1' ? 'Reviewer_1_UserCommen' : 'Reviewer_2_UserCommen';
  db.query(`UPDATE submitpaper SET ${column} = ? WHERE pid = ?`, [reply, paperId], (error, results) => {
    if (error) {
      res.status(500).send('Failed to post reply');
    } else {
      res.send('Reply posted successfully');
    }
  });
});


//------------------------------------------------------------------------------------------------------------------------------------------------
//End of this section code is for PaperInreview.jsx
//------------------------------------------------------------------------------------------------------------------------------------------------



//------------------------------------------------------------------------------------------------------------------------------------------------
//This section of the code is for ApplicationForReviewer.jsx 
//------------------------------------------------------------------------------------------------------------------------------------------------

// Query to select papers data from the database
app.get('/ApplicationForReviewer', (req, res) => {
  const selectQuery = `
    SELECT 
      pid,
      paper_title, 
      technologies, 
      cover_path, 
      paper_path, 
      paper_plagiarism_path,
      first_reviewer,
      second_reviewer
    FROM submitPaper`;
  
  // Execute the query
  db.query(selectQuery, (error, results) => {
    if (error) {
      console.error('Error fetching papers:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    // Log the fetched results for debugging
    console.log('Fetched papers:', results);

    // Check if any papers were found
    if (results.length === 0) {
      console.log('No papers found for the user');
      return res.status(404).json({ error: 'No papers found' });
    }
    // Send the papers data as JSON response
    res.json(results);
  });
});




// Define your endpoint to fetch reviewer information
app.get('/getReviewerInfo', (req, res) => {
  const query = `
    SELECT DISTINCT first_reviewer AS IJST_ID, first_reviewer AS name FROM submitPaper
    UNION
    SELECT DISTINCT second_reviewer AS IJST_ID, second_reviewer AS name FROM submitPaper`;
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching reviewers:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    const reviewerInfo = {};
    results.forEach(reviewer => {
      reviewerInfo[reviewer.id] = reviewer.name;
    });
    res.json(reviewerInfo);
  });
});


// Define your endpoint to save selected reviewer
app.post('/saveSelectedReviewer', (req, res) => {
  const { paperId, reviewer } = req.body;
  const reviewerId = req.session.userid;

  if (!reviewerId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  let columnToUpdate;
  if (reviewer === 'reviewer1') {
    columnToUpdate = 'first_reviewer';
  } else if (reviewer === 'reviewer2') {
    columnToUpdate = 'second_reviewer';
  } else {
    return res.status(400).json({ error: 'Invalid reviewer' });
  }

  const query = `
    UPDATE submitPaper
    SET ${columnToUpdate} = ?
    WHERE pid = ? AND (${columnToUpdate} IS NULL OR ${columnToUpdate} = '')
  `;

  const values = [reviewerId, paperId];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error('Error updating selected reviewer:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    console.log('Selected reviewer updated successfully');
    res.status(200).json({ message: 'Selected reviewer updated successfully' });
  });
});



app.post('/saveReviewDecision', (req, res) => {
  const { paperId, reviewer, decision, type } = req.body;
  const reviewerId = req.session.userid;

  if (!reviewerId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!['approve', 'reject'].includes(decision)) {
    return res.status(400).json({ error: 'Invalid decision' });
  }

  let decisionColumn = '';
  let decisionDateColumn = '';

  if (type === 'cover_letter') {
    switch (reviewer) {
      case 'reviewer1':
        decisionColumn = 'cover_letterDecesion1';
        decisionDateColumn = '1strev_decsion_date';
        break;
      case 'reviewer2':
        decisionColumn = 'cover_letterDecesion2';
        decisionDateColumn = '2ndrev_decsion_date';
        break;
      default:
        return res.status(400).json({ error: 'Invalid reviewer' });
    }
  } else if (type === 'paper') {
    switch (reviewer) {
      case 'reviewer1':
        decisionColumn = 'paper_Decesion1';
        decisionDateColumn = '1strev_decsion_date';
        break;
      case 'reviewer2':
        decisionColumn = 'paper_Decesion2';
        decisionDateColumn = '2ndrev_decsion_date';
        break;
      default:
        return res.status(400).json({ error: 'Invalid reviewer' });
    }
  } else if (type === 'plagiarism_report') {
    switch (reviewer) {
      case 'reviewer1':
        decisionColumn = 'paper_plagiarismDecesion1';
        decisionDateColumn = '1strev_decsion_date';
        break;
      case 'reviewer2':
        decisionColumn = 'paper_plagiarismDecesion2';
        decisionDateColumn = '2ndrev_decsion_date';
        break;
      default:
        return res.status(400).json({ error: 'Invalid reviewer' });
    }
  } else {
    return res.status(400).json({ error: 'Invalid decision type' });
  }

  const updateDecisionQuery = `
    UPDATE submitPaper
    SET ${decisionColumn} = ?
    WHERE pid = ?
  `;

  const values = [decision, paperId];

  db.query(updateDecisionQuery, values, (error, results) => {
    if (error) {
      console.error('Error updating review decision:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const checkStatusQuery = `
      SELECT
        cover_letterDecesion1, paper_Decesion1, paper_plagiarismDecesion1,
        cover_letterDecesion2, paper_Decesion2, paper_plagiarismDecesion2
      FROM submitPaper
      WHERE pid = ?
    `;

    db.query(checkStatusQuery, [paperId], (error, results) => {
      if (error) {
        console.error('Error fetching decision statuses:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      const decisions = results[0];

      // Check if all decisions for reviewer 1 are done
      if (decisions.cover_letterDecesion1 && decisions.paper_Decesion1 && decisions.paper_plagiarismDecesion1) {
        const updateDateQuery1 = `
          UPDATE submitPaper
          SET ${decisionDateColumn} = NOW()
          WHERE pid = ?
        `;

        db.query(updateDateQuery1, [paperId], (error, results) => {
          if (error) {
            console.error('Error updating decision date:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
          }
        });
      }

      // Check if all decisions for reviewer 2 are done
      if (decisions.cover_letterDecesion2 && decisions.paper_Decesion2 && decisions.paper_plagiarismDecesion2) {
        const updateDateQuery2 = `
          UPDATE submitPaper
          SET ${decisionDateColumn} = NOW()
          WHERE pid = ?
        `;

        db.query(updateDateQuery2, [paperId], (error, results) => {
          if (error) {
            console.error('Error updating decision date:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
          }
        });
      }

      const decisionsArray = Object.values(decisions);
      if (decisionsArray.every(decision => decision)) {
        const status = decisionsArray.includes('reject') ? 'Rejected' : 'Approved';

        const updateStatusQuery = `
          UPDATE submitPaper
          SET status = ?
          WHERE pid = ?
        `;

        db.query(updateStatusQuery, [status, paperId], (error, results) => {
          if (error) {
            console.error('Error updating status:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          console.log('Review decision, date, and status updated successfully');
          res.status(200).json({ message: 'Review decision, date, and status updated successfully' });
        });
      } else {
        console.log('Review decision saved successfully');
        res.status(200).json({ message: 'Review decision saved successfully' });
      }
    });
  });
});



app.post('/saveComments', (req, res) => {
  const { paperId, reviewer, comments, type } = req.body;
  const reviewerId = req.session.userid;

  if (!reviewerId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  let commentsColumn = '';

  if (type === 'cover_letter') {
    switch (reviewer) {
      case 'reviewer1':
        commentsColumn = 'Reviewer_1_comments';
        break;
      case 'reviewer2':
        commentsColumn = 'Reviewer_2_comments';
        break;
      default:
        return res.status(400).json({ error: 'Invalid reviewer' });
    }
  } else if (type === 'paper') {
    switch (reviewer) {
      case 'reviewer1':
        commentsColumn = 'Reviewer_1_comments';
        break;
      case 'reviewer2':
        commentsColumn = 'Reviewer_2_comments';
        break;
      default:
        return res.status(400).json({ error: 'Invalid reviewer' });
    }
  } else if (type === 'plagiarism_report') {
    switch (reviewer) {
      case 'reviewer1':
        commentsColumn = 'Reviewer_1_comments';
        break;
      case 'reviewer2':
        commentsColumn = 'Reviewer_2_comments';
        break;
      default:
        return res.status(400).json({ error: 'Invalid reviewer' });
    }
  } else {
    return res.status(400).json({ error: 'Invalid decision type' });
  }

  // Update the comments column
  const updateCommentsQuery = `
    UPDATE submitPaper
    SET ${commentsColumn} = ?
    WHERE pid = ?
  `;

  const values = [comments, paperId];

  db.query(updateCommentsQuery, values, (error, results) => {
    if (error) {
      console.error('Error updating comments:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    console.log('Comments updated successfully');
    res.status(200).json({ message: 'Comments updated successfully' });
  });
});



//------------------------------------------------------------------------------------------------------------------------------------------------
//End of this section code is for ApplicationForReviewer.jsx 
//------------------------------------------------------------------------------------------------------------------------------------------------


//------------------------------------------------------------------Jounel page-------------------------------------------------------------------


// Endpoint to get approved papers
app.get('/ApprovedPapers', (req, res) => {
  const selectQuery = `
    SELECT IJST_ID, submission_date, pid, paper_title, technologies, cover_name, cover_path,
           paper_name, paper_path, paper_plagiarism_name, paper_plagiarism_path, status,
           first_reviewer, second_reviewer, cover_letterDecesion1, paper_Decesion1,
           paper_plagiarismDecesion1, cover_letterDecesion2, paper_Decesion2,
           paper_plagiarismDecesion2, Reviewer_1_comments, Reviewer_2_comments,
           user_comments, Reviewer_1_UserCommen, Reviewer_2_UserCommen, citations,
           mla_citation, apa_citation, chicago_citation, harvard_citation, vancouver_citation,
           publishing_status
    FROM submitpaper
    WHERE publishing_status = 'Published'`;
  const values = [req.session.userid];

  db.query(selectQuery, values, (error, results) => {
    if (error) {
      console.error('Error fetching approved papers:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    console.log('Fetched approved papers:', results);

    if (results.length === 0) {
      console.log('No approved papers found for the user');
      return res.status(404).json({ error: 'No approved papers found' });
    }

    res.json(results);
  });
});



// Endpoint to handle citation
app.post('/citePaper', (req, res) => {
  const { pid } = req.body;
  const userIJST_ID = req.session.userid; // Fetch the logged-in user ID from the session

  if (!userIJST_ID) {
    return res.status(401).json({ error: 'User is not logged in' });
  }

  // Insert citation details into the user_citations table
  const insertCitationQuery = `
    INSERT INTO user_citations (user_ijst_id, paper_id)
    VALUES (?, ?)`;
  const insertValues = [userIJST_ID, pid];

  db.query(insertCitationQuery, insertValues, (error, results) => {
    if (error) {
      console.error('Error inserting citation details:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Update the citation count in the submitpaper table
    const updateQuery = `
      UPDATE submitpaper
      SET citations = COALESCE(citations, 0) + 1
      WHERE pid = ?`;
    const updateValues = [pid];

    db.query(updateQuery, updateValues, (error, results) => {
      if (error) {
        console.error('Error updating citation count:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      res.json({ message: 'Citation recorded successfully' });
    });
  });
});

//-----------------------------------------------------------------End of Jounel page----------------------------------------------------



//-----------------------------------------------------------Book Page which allows user for citation-------------------------------------//
app.get('/ApprovedBooks', (req, res) => {
  const selectQuery = `
    SELECT IJST_ID, submission_date, bid, book_title, technologies, cover_name, cover_path,
           book_name, book_path, book_plagiarism_name, book_plagiarism_path, status,
           first_reviewer, second_reviewer, cover_letterDecesion1, book_Decesion1,
           book_plagiarismDecesion1, cover_letterDecesion2, book_Decesion2,
           book_plagiarismDecesion2, Reviewer_1_comments, Reviewer_2_comments,
           user_comments, Reviewer_1_UserCommen, Reviewer_2_UserCommen, citations,
           mla_citation, apa_citation, chicago_citation, harvard_citation, vancouver_citation
    FROM submitbook
    WHERE status = 'Approved'`;

  db.query(selectQuery, (error, results) => {
    if (error) {
      console.error('Error fetching approved books:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'No approved books found' });
    }

    res.json(results);
  });
});



app.post('/citeBook', (req, res) => {
  const { bid } = req.body;
  const userIJST_ID = req.session.userid; 

  if (!userIJST_ID) {
    return res.status(401).json({ error: 'User is not logged in' });
  }

  const insertCitationQuery = `
    INSERT INTO book_citations (user_ijst_id, book_id)
    VALUES (?, ?)`;
  const insertValues = [userIJST_ID, bid];

  db.query(insertCitationQuery, insertValues, (error, results) => {
    if (error) {
      console.error('Error inserting citation details:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const updateQuery = `
      UPDATE submitbook
      SET citations = COALESCE(citations, 0) + 1
      WHERE bid = ?`;
    const updateValues = [bid];

    db.query(updateQuery, updateValues, (error, results) => {
      if (error) {
        console.error('Error updating citation count:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      res.json({ message: 'Citation recorded successfully' });
    });
  });
});

//----------------------------------------------------------------------------------------------------------------------------------------//

// Serve static files from the 'uploads' directory
app.use('./public/files', express.static(path.join(__dirname, './public/files')));

// Define endpoint to serve PDF files
app.get('/file/:paperFileName', (req, res) => {
  const paperFileName = req.params.paperFileName;
  // Construct the path to the uploaded file
  const filePath = path.join(__dirname, 'public', 'files', paperFileName); 
  
  // Send the file as a response
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(404).send('File not found');
    }
  });
});


app.get('/getUserId', (req, res) => {
  if (req.session.userid) {
    const userid = req.session.userid;

      if (results.length > 0) {
        const empid = results[0].empid;
        res.status(200).json({ userid, empid });
      }
    }
});



const pdfStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "./public/rolesfiles";
    console.log("Destination Directory:", uploadDir); // Debug statement
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const uploadPDF = multer({ storage: pdfStorage });

// Serve static PDF files
app.use('/public/rolesfiles', express.static(path.join(__dirname, 'public/rolesfiles')));

// Endpoint to handle form submission
app.post('/reviewer', uploadPDF.fields([
  { name: 'publication_certificate', maxCount: 1 },
  { name: 'publication_authorization_letter', maxCount: 1 },
  { name: 'publication_digital_signature', maxCount: 1 },

  { name: 'high_school_certificate', maxCount: 1 },
  { name: 'preuniversity_certificate', maxCount: 1 },
  { name: 'under_graduate_certificate', maxCount: 1 },
  { name: 'post_graduate_certificate', maxCount: 1 },
  { name: 'phd_certificate', maxCount: 1 },
  

  { name: 'corporate_employee_idcard', maxCount: 1 },
  { name: 'student_idcard', maxCount: 1 },


  { name: 'corporate_incorporation_certificate', maxCount: 1 },
  { name: 'corporate_authorization_letter', maxCount: 1 },
  { name: 'corporate_digital_signature', maxCount: 1 },
  { name: 'government_id_proof', maxCount: 1 },
]), (req, res) => {
  if (!req.session.userid) {
    return res.status(401).send("Unauthorized");
  }

  console.log('Files Uploaded:', req.files); // Log uploaded files
  console.log('Body:', req.body); // Log request body

  const {
    request_type, employee_id, role_needed, role_type, publication_organization_name,
    publication_register_number, publication_gst_number,publication_certificate,publication_authorization_letter,publication_digital_signature,
    student_organisation,student_id,student_email, student_idcard,
    corporate_employee_organisation,corporate_employee_id,corporate_employee_email,corporate_employee_idcard,
    high_school_certificate, preuniversity_certificate, under_graduate_certificate, post_graduate_certificate, phd_certificate, 
    corporate_IJST_identification_number,corporate_organization_name, corporate_incorporation_number, corporate_gst_number, corporate_incorporation_certificate, corporate_authorization_letter, corporate_digital_signature,corporate_email_domain,
    government_id_proof
  } = req.body;

  const id = req.session.userid;
  const filePaths = {};
  for (let key in req.files) {
    filePaths[key] = req.files[key][0].path.replace(/\\/g, '/');
  }


  // Determine the SQL query and parameters based on the request type
  let sql;
  const params = [
    request_type,id, employee_id, role_needed, role_type,
    publication_organization_name,publication_register_number, publication_gst_number, filePaths['publication_certificate'], filePaths['publication_authorization_letter'], filePaths['publication_digital_signature'],
    student_organisation, student_id, student_email, filePaths['student_idcard'], 
    corporate_employee_organisation, corporate_employee_id, corporate_employee_email, filePaths['corporate_employee_idcard'], 
    filePaths['high_school_certificate'], filePaths['preuniversity_certificate'], filePaths['under_graduate_certificate'], filePaths['post_graduate_certificate'], 
    filePaths['phd_certificate'],corporate_IJST_identification_number, corporate_organization_name, corporate_incorporation_number, corporate_gst_number, 
    filePaths['corporate_incorporation_certificate'], filePaths['corporate_authorization_letter'],  filePaths['corporate_digital_signature'],corporate_email_domain,filePaths['government_id_proof']
  ];
 

  sql = `INSERT INTO user_requests (
    request_type,IJST_ID, employee_id, role_needed, role_type,
    publication_organization_name,publication_register_number, publication_gst_number,publication_certificate,publication_authorization_letter, publication_digital_signature,
    student_organisation, student_id, student_email,student_idcard, 
    corporate_employee_organisation, corporate_employee_id, corporate_employee_email,corporate_employee_idcard, 
    high_school_certificate,preuniversity_certificate, under_graduate_certificate,post_graduate_certificate, 
    phd_certificate,corporate_IJST_identification_number, corporate_organization_name, corporate_incorporation_number, corporate_gst_number, 
    corporate_incorporation_certificate ,corporate_authorization_letter,corporate_digital_signature,corporate_email_domain,government_id_proof
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?)`;

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Database insert error:', err);
      return res.status(500).json({ message: 'Database insert error' });
    }
    console.log('Data inserted successfully:', results);
    const query = "SELECT email FROM users WHERE IJST_ID = ?";
    db.query(query, [id], (error, results) => {
      if (error) {
        console.error("Error executing query:", error);
        return res.json({ valid: false, message: 'Error fetching user details' });
      }

      if (results && results.length > 0) {
        const email = results[0].email;
        console.log('Sending email to:', email); // Added log for email

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
             user: 'your email should write here ',
               pass: 'your-app-password-here'
          }
        });

        // Email content
        const mailOptions = {
          from: 'your email should write here ',
          to: email,
          subject: 'Welcome to our website',
          text: `Your request has been submitted, please wait for the response`
        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Error sending email' });
          }
          console.log('Email sent successfully:', info.response); // Added log for successful email
          res.status(200).json({ message: 'Data received and processed successfully' });
        });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    });
  });
});

app.get('/Display_status', (req, res) => {
  const id = req.session.userid;
  // Query to select users data from the database
  const selectQuery = 'SELECT IJST_ID, request_ID, request_type, role_status FROM user_requests where IJST_ID=?';
  // Execute the query
  db.query(selectQuery, id, (error, results) => {
      if (error) {
          console.error('Error fetching role:', error);
          return res.status(500).json({ error: 'Internal server error' });
      }

      // Log the fetched results for debugging
      console.log('Fetched role:', results);

      // Check if any users were found
      if (results.length === 0) {
          console.log('No role found for the user');
          return res.status(404).json({ error: 'No role found' });
      }

      // Send the users data as JSON response
      res.json(results);
  });
});

app.post('/delete_request', (req, res) => {
  const { id,request_type } = req.body;
  console.log( id,request_type);
  const deleteQuery = 'DELETE FROM user_requests WHERE IJST_ID = ? and request_type=?';
  db.query(deleteQuery, [id, request_type], (error, results) => {
    if (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'User ID not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  });
});





app.get('/role_approval', (req, res) => {
  // Extract parameters from request, assuming these are received as query parameters or body parameters
  const { request_type, corporate_organization_name } = req.query;

  // Default select query to select all user requests
  let selectQuery = 'SELECT * FROM user_requests';

  // If request_type is 'corporate', modify the query to filter by organization name
  if (request_type === 'corporate') {
    selectQuery = `
      SELECT * FROM user_requests
      WHERE (request_type = 'Employee' AND corporate_employee_organisation = ?) 
      OR (request_type = 'Student' AND student_organisation = ?);
    `;
  }

  // Parameters to be used in the query based on the condition
  const queryParams = [corporate_organization_name, corporate_organization_name];

  // Execute the query
  db.query(selectQuery, queryParams, (error, results) => {
    if (error) {
      console.error('Error fetching roles:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Check if any users were found
    if (results.length === 0) {
      console.log('No roles found for the user');
      return res.status(404).json({ error: 'No roles found' });
    }

    // Send the users data as JSON response
    res.json(results);
  });
});

app.post('/update_role_status', (req, res) => {
  const { ids, newStatus, request_types, requestIDs } = req.body;

  console.log('Received requestIDs:', requestIDs);
  console.log('Received newStatus:', newStatus);

  if (!ids || !newStatus || !request_types || !requestIDs) {
    return res.status(400).json({ error: 'Invalid request data' });
  }

  const requestTypePlaceholders = Array(request_types.length).fill('?').join(', ');
  const dynamicUpdateQuery = `UPDATE user_requests SET role_status = ? WHERE request_ID IN (?) AND request_type IN (${requestTypePlaceholders})`;
  console.log('Dynamic query:', dynamicUpdateQuery);

 // const queryParams = [newStatus, requestIDs.join(', '), ...request_types];
 const queryParams = [newStatus, requestIDs, ...request_types];
  db.query(dynamicUpdateQuery, queryParams, (error, results) => {
    if (error) {
      console.error('Error updating role status:', error.message);
      return res.status(500).json({ error: 'Internal server error', details: error.message });
    }

    if (newStatus === 'Approved' || newStatus === 'Rejected') {
      const query = "SELECT email FROM users WHERE IJST_ID = ?";

      ids.forEach(id => {
        db.query(query, [id], (error, results) => {
          if (error) {
            console.error("Error executing query:", error);
            return;
          }

          if (results && results.length > 0) {
            const email = results[0].email;
            console.log('Sending email to:', email);

            const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                 user: 'your email should write here ',
               pass: 'your-app-password-here'
              }
            });

            const mailOptions = {
              from: 'your email should write here ',
              to: email,
              subject: 'Update on Your Role Request',
              text: `Your request status has been updated to: ${newStatus}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.error('Error sending email:', error);
                return;
              }
              console.log('Email sent successfully:', info.response);
            });
          } else {
            console.log('User not found for ID:', id);
          }
        });
      });
    }

    if (newStatus === 'Approved') {
      const fetchApprovedRequestsQuery = `SELECT IJST_ID, request_type, role_needed FROM user_requests WHERE role_status = 'Approved' AND IJST_ID IN (?)`;
      db.query(fetchApprovedRequestsQuery, [ids], (error, results) => {
        if (error) {
          console.error('Error fetching approved requests:', error.message);
          return res.status(500).json({ error: 'Internal server error', details: error.message });
        }

        const updateUserRole = (index) => {
          if (index >= results.length) {
            console.log('User roles updated successfully');
            return res.json({ message: 'Role status updated and user roles set successfully' });
          }

          const row = results[index];
          const updateRoleQuery = `UPDATE users SET role = ? WHERE IJST_ID = ?`;

          db.query(updateRoleQuery, [row.request_type, row.IJST_ID], (error) => {
            if (error) {
              console.error('Error updating user role:', error.message);
              return res.status(500).json({ error: 'Internal server error', details: error.message });
            }

            const checkEmployeeQuery = `SELECT IJST_ID FROM employee WHERE IJST_ID = ?`;
            db.query(checkEmployeeQuery, [row.IJST_ID], (error, results) => {
              if (error) {
                console.error('Error checking employee ID:', error.message);
                return res.status(500).json({ error: 'Internal server error', details: error.message });
              }

              if (results.length > 0) {
                const updateEmployeeRoleNeededQuery = `UPDATE employee SET role_needed = ? WHERE IJST_ID = ?`;
                db.query(updateEmployeeRoleNeededQuery, [row.role_needed, row.IJST_ID], (error) => {
                  if (error) {
                    console.error('Error updating employee role_needed:', error.message);
                    return res.status(500).json({ error: 'Internal server error', details: error.message });
                  }

                  console.log('Employee role_needed updated successfully');
                  updateUserRole(index + 1);
                });
              } else {
                updateUserRole(index + 1);
              }
            });
          });
        };

        updateUserRole(0);
      });
    } else {
      console.log('Role status updated:', results);
      res.json({ message: 'Role status updated successfully' });
    }
  });
});



app.post('/Idvarify', (req, res) => {
  const { id } = req.body;
  const selectQuery = 'SELECT role_needed FROM user_requests WHERE IJST_ID = ?';
  db.query(selectQuery, [id], (error, results) => {
    if (error) {
      console.error('Error fetching current role:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    console.log('role_needed:', results);
    if (results.length === 0) {
      return res.status(404).json({ error: 'User ID not found' });
    }
    const roleNeeded = results[0].role_needed;
    res.status(200).json({ role_needed: roleNeeded });
  });
});


app.post('/updateRoles', (req, res) => {
  const { id, roles} = req.body;

  console.log('Received id:', id);
  console.log('Received roles:', roles);


  if (!id || !roles) {
    return res.status(400).json({ error: 'Invalid request data' });
  }

  // Convert the roles array to a string
  const roleString = roles.join(', ');

  const updateQuery = 'UPDATE user_requests SET role_needed = ? WHERE IJST_ID = ?';
  console.log('Executing query:', updateQuery);
  console.log('With parameters:', [roleString, id]);
  

  db.query(updateQuery, [roleString, id], (error, results) => {
    if (error) {
      console.error('Error updating role status:', error.message);
      return res.status(500).json({ error: 'Internal server error', details: error.message });
    }

    console.log('Role status updated:', results);
    res.json({ message: 'Role status updated successfully' });
  });
});

app.post('/Fetch_User', (req, res) => {
  const { id } = req.body;
  const selectQuery = 'SELECT * FROM user_requests WHERE IJST_ID = ?';
  db.query(selectQuery, [id], (error, results) => {
    if (error) {
      console.error('Error fetching current role:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    console.log('Data:', results);
    if (results.length === 0) {
      return res.status(404).json({ error: 'User ID not found' });
    }
    res.status(200).json({ Data: results }); // Ensure results are sent as 'Data'
  });
});

app.post('/update_role_Deactivat',(req, res) => {
  const { id, newStatus} = req.body;
  console.log('Received id:', id);
  console.log('Received roles:', newStatus);

  if (!id || !newStatus) {
    return res.status(400).json({ error: 'Invalid request data' });
  }

  const updateQuery = 'UPDATE user_requests SET role_status = ? WHERE IJST_ID = ?';
  console.log('Executing query:', updateQuery);
  console.log('With parameters:', [newStatus, id]);

  db.query(updateQuery, [newStatus, id], (error, results) => {
    if (error) {
      console.error('Error updating role status:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'User ID not found' });
    }
    const query = "SELECT email FROM users WHERE IJST_ID = ?";
    db.query(query, [id], (error, results) => {
      if (error) {
        console.error("Error executing query:", error);
        return res.json({ valid: false, message: 'Error fetching user details' });
      }

      if (results && results.length > 0) {
        const email = results[0].email;
        console.log('Sending email to:', email); // Added log for email

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
          user: 'your email should write here ',
               pass: 'your-app-password-here'
          }
        });

        // Email content
        const mailOptions = {
          from: 'your email should write here ',
          to: email,
          subject: 'Update on Your user account',
          text: `Sorry, your user account is being Deactivated`
        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Error sending email' });
          }
          console.log('Email sent successfully:', info.response); 
          res.status(200).json({ message: 'Data received and processed successfully' });
        });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    });
    res.status(200).json({ message: 'User deactivated successfully' });
  });
});

app.post('/delete_user', (req, res) => {
  const { id } = req.body;
  const deleteQuery = 'DELETE FROM user_requests WHERE IJST_ID = ?';
  const deleteUser='DELETE FROM users WHERE IJST_ID = ?'

  db.query(deleteQuery,deleteUser, [id], (error, results) => {
    if (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'User ID not found' });
    }
    const query = "SELECT email FROM users WHERE id = ?";
    db.query(query, [id], (error, results) => {
      if (error) {
        console.error("Error executing query:", error);
        return res.json({ valid: false, message: 'Error fetching user details' });
      }

      if (results && results.length > 0) {
        const email = results[0].email;
        console.log('Sending email to:', email); // Added log for email

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
             user: 'your email should write here ',
               pass: 'your-app-password-here'
          }
        });

        // Email content
        const mailOptions = {
          from: 'your email should write here ',
          to: email,
          subject: 'Update on Your user account',
          text: `Sorry, Your user account is being Deleted`
        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Error sending email' });
          }
          console.log('Email sent successfully:', info.response); // Added log for successful email
          res.status(200).json({ message: 'Data received and processed successfully' });
        });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    });
    res.status(200).json({ message: 'User deleted successfully' });
  });
});

//Community
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "./public/communityAdmin";
    console.log("Destination Directory:", uploadDir); // Debug statement
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const uploadImage = multer({ storage: imageStorage });


app.post('/Admin',uploadImage.single('Communitypath'), (req, res) => {
    if (!req.session.userid) {
        return res.status(401).send("Unauthorized");
    }

    const communityName = req.body.communityName;
    const communityPath = req.file.path.replace(/\\/g, '/');
    console.log('Request received:', req.body);
    const values = [
      
        communityName,
        communityPath,
       
    ];

    const insertQuery = `
        INSERT INTO community ( Communityname, Communitypath)
        VALUES (?, ?)
    `;

    db.query(insertQuery, values, (error, results) => {
        if (error) {
            console.error("Error inserting data into community table:", error);
            return res.status(500).send("Error inserting data into community table.");
        }
        res.send('Files uploaded and data inserted into community table successfully.');
    });
});
// Endpoint to get community names
app.get('/api/communities', (req, res) => {
  const sql = 'SELECT Communityname FROM community';
  db.query(sql, (err, results) => {
      if (err) {
          return res.status(500).json({ error: err });
      }
      res.json(results);
  });
});

app.post('/Admin/update-community', upload.single('communityPath'), (req, res) => {
  if (!req.session.userid) {
    return res.status(401).send("Unauthorized");
  }
  const newcommunityName = req.body.newcommunityName;
  const communityName = req.body.communityName;
  const communityPath = req.file ? req.file.path.replace(/\\/g, '/') : null; // Handle case where file is not provided
  console.log('Request received:', req.body);
  const updateQuery = `
  UPDATE community 
  SET communityName = ?, 
  Communitypath = ?
  WHERE Communityname = ?;
`;
const queryData = [newcommunityName,communityPath, communityName];

  db.query(updateQuery, queryData,(error, results) => {
    if (error) {
      console.error("Error updating data in community table:", error);
      return res.status(500).send("Error updating data in community table.");
    }
    if (results.affectedRows > 0) {
      res.send('Community updated successfully.');
    } else {
      res.status(404).send('Community not found.');
    }
  });
});



// Delete community route
app.post('/Admin/delete-community', (req, res) => {
 // Extract the community name from the request body
 const { communityName } = req.body;

  // Execute the DELETE query to delete the community from the database
  const deleteQuery = 'DELETE FROM community WHERE Communityname = ?';

  db.query(deleteQuery, [communityName], (error, results) => {
      if (error) {
          console.error("Error deleting data from community table:", error);
          return res.status(500).send("Error deleting data from community table.");
      }
      if (results.affectedRows > 0) {
          res.send('Community deleted successfully.');
      } else {
          res.status(404).send('Community not found.');
      }
  });
});

app.post('/Admin/deactivate-community', (req, res) => {
  const { communityName, status } = req.body;

  if (!req.session.userid) {
    return res.status(401).send("Unauthorized");
  }

  const updateQuery = `
    UPDATE community 
    SET status = ?
    WHERE Communityname = ?;
  `;

  const queryData = [status, communityName];

  db.query(updateQuery, queryData, (error, results) => {
    if (error) {
      console.error("Error updating status of community:", error);
      return res.status(500).send("Error updating status of community.");
    }
    if (results.affectedRows > 0) {
      res.send('Community deactivated successfully.');
    } else {
      res.status(404).send('Community not found.');
    }
  });
});




app.get('/communities', (req, res) => {
  const selectQuery = 'SELECT * FROM community';

  db.query(selectQuery, (error, results) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.json(results);
  });
});

//Admin page community Interest 
app.post('/interst', (req, res) => {
  const { interestName } = req.body;
  console.log('Request received:',interestName );

  const insertQuery = `
    INSERT INTO interst (Insertname)
    VALUES (?)
  `;

  db.query(insertQuery, [interestName], (error, results) => {
    if (error) {
      console.error("Error inserting data into interst table:", error);
      return res.status(500).send("Error inserting data into interst table.");
    }
    res.send('Data inserted into interst table successfully.');
  });
});



// Endpoint to get community names
app.get('/api/interest', (req, res) => {
  const sql = 'SELECT Insertname FROM interst';
  db.query(sql, (err, results) => {
      if (err) {
          return res.status(500).json({ error: err });
      }
      res.json(results);
  });
});

// Correct route URL
app.post('/interst/update-interst', (req, res) => {
  // Extract new interest name and existing interest name from request body
  const newInterestName = req.body.NewInterestName;
  const interestName = req.body.Insertname;

  // SQL query to update the interest name in the table
  const updateQuery = `
    UPDATE interst
    SET Insertname = ?
    WHERE Insertname = ?`;

  // Data to be used in the SQL query
  const queryData = [newInterestName, interestName];

  // Execute the SQL query
  db.query(updateQuery, queryData, (error, results) => {
    if (error) {
      // Log error and send a 500 response if there's an error in the query execution
      console.error("Error updating data in interst table:", error);
      return res.status(500).send("Error updating data in interst table.");
    }

    // Check if any rows were affected (i.e., updated)
    if (results.affectedRows > 0) {
      console.log(results);
      // Send success response if the update was successful
      res.send('Interest updated successfully.');
    } else {
      // Send a 404 response if no rows were updated (i.e., interest name not found)
      res.status(404).send('Interest not found.');
    }
  });
});



app.post('/interest/delete-interest', (req, res) => {
  const { Insertname } = req.body;
  console.log("Request to delete:", req.body);  // Log incoming request

  const deleteQuery = `
    DELETE FROM  interst WHERE  Insertname = ?`;

  db.query(deleteQuery, [Insertname], (error, results) => {
    if (error) {
      console.error("Error deleting data from community table:", error);
      return res.status(500).send("Error deleting data from community table.");
    }
    if (results.affectedRows > 0) {
      res.send('Community deleted successfully.');
    } else {
      res.status(404).send('Community not found.');
    }
  });
});


// Route to handle deactivating a community interest
app.post('/api/deactivate-interest', async (req, res) => {
  // Extract interestName and status from request body
  const { interestName, status } = req.body;

  // Check if user is authenticated using session userid (example check)
  if (!req.session.userid) {
    return res.status(401).send("Unauthorized");
  }

  // SQL query to update the status of the community interest
  const updateQuery = `
    UPDATE interst SET status = ? WHERE Insertname = ?`;

  // Execute the SQL query using the database connection (db.query)
  db.query(updateQuery, [status, interestName], (error, results) => {
    if (error) {
      console.error("Error updating status of interest:", error);
      return res.status(500).send("Error updating status of interest.");
    }

    // Check if any rows were affected by the update
    if (results.affectedRows > 0) {
      // If rows were updated successfully, send success response
      res.send('Interest status updated successfully.');
    } else {
      // If no rows were updated (community not found), send 404 error
      res.status(404).send('Interest not found.');
    }
  });
});
// API endpoint to fetch all interests
app.get('/interest', (req, res) => {
  const selectQuery = 'SELECT * FROM interst';
  db.query(selectQuery, (error, results) => {
      if (error) {
          console.error('Database error:', error);
          return res.status(500).send(error);
      }
      res.json(results);
  });
});
app.post('/technology_interest', (req, res) => {
  const { selectedInterests } = req.body;
  const userId = req.session.userid;

  if (!selectedInterests || selectedInterests.length === 0) {
    return res.status(400).json({ error: 'No interests selected' });
  }

  // Validate each interest object has an Insertname property
  const invalidInterests = selectedInterests.some(interest => !interest.Insertname);
  if (invalidInterests) {
    return res.status(400).json({ error: 'Invalid interest format' });
  }

  // Concatenate the selected interests into a single string
  const selectedNames = selectedInterests.map(interest => interest.Insertname).join(', ');

  // Check if user has existing data
  const checkQuery = 'SELECT technology_name FROM technology_interests WHERE user_id = ?';
  db.query(checkQuery, [userId], (checkError, checkResults) => {
    if (checkError) {
      console.error('Error checking existing data:', checkError);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (checkResults.length > 0) {
      // User already has an entry, update it
      const updateQuery = 'UPDATE technology_interests SET technology_name = ? WHERE user_id = ?';
      db.query(updateQuery, [selectedNames, userId], (updateError) => {
        if (updateError) {
          console.error('Error updating data:', updateError);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        console.log('Data updated successfully');
        res.status(200).json({ message: 'Data updated successfully' });
      });
    } else {
      // No existing entry, insert new record
      const insertQuery = 'INSERT INTO technology_interests (user_id, technology_name) VALUES (?, ?)';
      db.query(insertQuery, [userId, selectedNames], (insertError) => {
        if (insertError) {
          console.error('Error inserting data:', insertError);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        console.log('Data inserted successfully');
        res.status(200).json({ message: 'Data inserted successfully' });
      });
    }
  });
});


// to fetch pdf (interesr.jsx page )
app.get('/api/getPdf', (req, res) => {
  const tech = req.query.tech;
  const query = 'SELECT technologies,paper_name,paper_path FROM submitPaper  WHERE technologies = ?';
  db.query(query, [tech], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
  } else if (result.length > 0) {
    console.log(result)
      res.json({ pdfUrl: result[0].paper_path , paperName: result[0].paper_name});
  } else {
      res.status(404).json({ message: 'PDF not found' });
  }
});
});

// Fetch Employee Details
app.post('/Fetch_Employee', (req, res) => {
  const { IJSTID } = req.body;

    const selectQuery = 'SELECT name FROM users WHERE IJST_ID = ?';

    db.query(selectQuery, [IJSTID], (error, userResults) => {
      if (error) {
        console.error('Error fetching user name:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (userResults.length === 0) {
        return res.status(404).json({ error: 'User ID not found' });
      }

      const resultData = {
        name: userResults[0].name
      };

      res.status(200).json({ Data: resultData });
    });
  });
// });


app.post('/Fetch_Organisation', (req, res) => {
  const userId = req.session.userid;
  const selectCorporate = 'SELECT corporate_organization_name, corporate_IJST_identification_number,corporate_email_domain FROM user_requests WHERE IJST_ID = ?';

  db.query(selectCorporate, [userId], (error, corporateResults) => {
    if (error) {
      console.error('Error fetching corporate organization name:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (corporateResults.length === 0) {
      return res.status(404).json({ error: 'Corporate organization not found' });
    }

    // Extracting data from the first row of corporateResults array
    const resultData = {
      corporate_organization_name: corporateResults[0].corporate_organization_name,
      corporate_IJST_identification_number: corporateResults[0].corporate_IJST_identification_number,
      corporate_email_domain:corporateResults[0].corporate_email_domain
    };
console.log(resultData);
    res.status(200).json({ Data: resultData });
  });
});



//Add Employee
app.post('/AddEmp', (req, res) => {
  const { IJSTID,EmpId,mailId,corporateOrganizationName} = req.body;
  const selectCorporateQuery = 'SELECT corporate_employee_organisation FROM user_requests WHERE IJST_ID = ?';

  db.query(selectCorporateQuery, [IJSTID], (error, corporateResults) => {
    if (error) {
      console.error('Error fetching corporate IJST identification number:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (corporateResults.length === 0) {
      return res.status(404).json({ error: 'Corporate IJST identification number not found for the given IJSTID' });
    }

    // Declare fetchedCorporateIJSTNo here
    const fetchedCorporateIJSTNo = corporateResults[0].corporate_employee_organisation;
    console.log('Fetched corporate name:', fetchedCorporateIJSTNo);
    console.log('Requested corporate Name:', corporateOrganizationName);

    // Check if fetched corporate IJST number matches with corporateOrganizationIJSTNo
    if (fetchedCorporateIJSTNo !== corporateOrganizationName) {
      return res.status(400).json({ error: 'Corporate IJST identification number does not match' });
    }
  const query = 'INSERT INTO corporate_employee (empid, IJST_ID, Official_mail) VALUES (?,?,?)';
  db.query(query, [EmpId,IJSTID,mailId], (err, results) => {
    if (err) {
      console.error('Error inserting employee:', err);
      res.status(500).json({ error: 'Error inserting employee' });
      return;
    }
    res.status(200).json({ message: 'Employee successfully added' });
  });
});
});

app.post('/UpdateEmpRole', (req, res) => {
  const { IJSTID , role} = req.body;
  const userId = req.session.userid;

  const selectCorporate = 'SELECT corporate_organization_name FROM user_requests WHERE IJST_ID = ?';

  db.query(selectCorporate, [userId], (error, corporateResults) => {
    if (error) {
      console.error('Error fetching corporate organization name:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (corporateResults.length === 0) {
      return res.status(404).json({ error: 'Corporate organization not found' });
    }

    // Extract corporate_organization_name
    const corporateOrganizationName = corporateResults[0].corporate_organization_name;
   
    // Query to select corporate_IJST_identification_number based on IJSTID
    const selectCorporateQuery = 'SELECT corporate_employee_organisation, request_ID FROM user_requests WHERE IJST_ID = ?';

    db.query(selectCorporateQuery, [IJSTID], (error, corporateResults) => {
      if (error) {
        console.error('Error fetching corporate IJST identification number:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (corporateResults.length === 0) {
        return res.status(404).json({ error: 'Corporate IJST identification number not found for the given IJSTID' });
      }
      const request_ID = corporateResults[0].request_ID;
      // Declare fetchedCorporateIJSTNo here
      const fetchedCorporateIJSTNo = corporateResults[0].corporate_employee_organisation;
      console.log('Fetched corporate name:', fetchedCorporateIJSTNo);
      console.log('Requested corporate Name:', corporateOrganizationName);

      // Check if fetched corporate IJST number matches with corporateOrganizationName
      if (fetchedCorporateIJSTNo !== corporateOrganizationName) {
        return res.status(400).json({ error: 'Corporate IJST identification number does not match' });
      }

      // If it matches, proceed to fetch the employee name
      const updateQuery = 'UPDATE user_requests SET role_needed=? WHERE request_ID = ?';
      db.query(updateQuery, [role,request_ID], (error, userResults) => {
        if (error) {
          console.error('Error updating user role:', error);
          return res.status(500).json({ error: 'Internal server error' });
        }

        if (userResults.affectedRows === 0) {
          return res.status(404).json({ error: 'Request ID not found' });
        }
      });
       const updateEmpQuery = 'UPDATE corporate_employee SET role_needed=? WHERE IJST_ID = ?';
      db.query(updateEmpQuery, [role,IJSTID], (error, userResults) => {
        if (error) {
          console.error('Error updating user role:', error);
          return res.status(500).json({ error: 'Internal server error' });
        }

        if (userResults.affectedRows === 0) {
          return res.status(404).json({ error: 'Request ID not found' });
        }

        res.status(200).json({ message: 'Employee role successfully updated' });
      });
    });
  });
});



//Employee delete
app.get('/Display_Emp', (req, res) => {
  const query = 'SELECT * FROM corporate_employee';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).json({ error: 'Error fetching data' });
      return;
    }
    res.json(results);
  });
});



// Route to delete an employee
app.post('/deactivate_Emp', (req, res) => {
  const { IJST_ID,status} = req.body;
  const updateQuery = 'UPDATE user_requests SET role_status = ? WHERE IJST_ID = ?';
  console.log('Executing query:', updateQuery);
  console.log('With parameters:', [status, IJST_ID]);

  db.query(updateQuery, [status, IJST_ID], (error, results) => {
    if (error) {
      console.error('Error updating role status:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'IJST ID not found' });
    }
    

    const query = "SELECT email FROM users WHERE IJST_ID = ?";
    db.query(query, [IJST_ID], (error, results) => {
      if (error) {
        console.error("Error executing query:", error);
        return res.json({ valid: false, message: 'Error fetching user details' });
      }

      if (results && results.length > 0) {
        const email = results[0].email;
        console.log('Sending email to:', email); // Added log for email

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
          user: 'your email should write here ',
               pass: 'your-app-password-here'
          }
        });

        // Email content
        const mailOptions = {
          from: 'your email should write here ',
          to: email,
          subject: 'Update on Your user account',
          text: `Sorry, your user account is being Deactivated`
        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Error sending email' });
          }
          console.log('Email sent successfully:', info.response); // Added log for successful email
          res.status(200).json({ message: 'Data received and processed successfully' });
        });
      } else {
        res.status(404).json({ message: 'Employee not found' });
      }
    });
    res.status(200).json({ message: 'Employee deactivated successfully' });
  });
});

//Employee delete
app.get('/corporate/Search_Employee', (req, res) => {
  const {data}=req.body
  const query = 'SELECT * FROM corporate_employee where empid=? or IJST_ID=?';

  db.query(query,[data,data], (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).json({ error: 'Error fetching data' });
      return;
    }
    res.json(results);
  });
});



//community page serach box
app.post('/search-or-add', (req, res) => {
  const { query, newAnswer, communityName } = req.body;
  if (!query) {
    return res.status(400).send('Query is required');
  }

  db.query('SELECT question FROM question_answer WHERE question LIKE ?', [`%${query}%`], (err, results) => {
    if (err) {
      console.error('Error searching database:', err);
      return res.status(500).send('An error occurred while searching the database');
    }

    if (results.length > 0) {
      return res.send(results);
    } else {
      // If newAnswer is provided, add the question to the database
      if (newAnswer) {
        // Make sure to include the answer in the INSERT query
        const { answer } = req.body;
        if (!answer) {
          return res.status(400).send('Answer is required');
        }

        db.query('INSERT INTO question_answer(question, answer, Community_name) VALUES (?, ?, ?)', [query, answer, communityName], (err, result) => {
          if (err) {
            console.error('Error inserting new question:', err);
            return res.status(500).send('An error occurred while adding the new question');
          }
          console.log('Insert Result:', result);
          res.send({ message: 'New question added', id: result.insertId });
        });
      } else {
        res.send([]);
      }
    }
  });
});

app.post('/search-answer', (req, res) => {
  const { question} = req.body;
  if (!question) {
    return res.status(400).send('Query is required');
  }

  db.query('SELECT answer FROM question_answer WHERE question=?', [question], (err, results) => {
    if (err) {
      console.error('Error searching database:', err);
      return res.status(500).send('An error occurred while searching the database');
    }

    if (results.length > 0) {
      return res.send(results);
    } else {
      res.send([]);
    }
  });
});


// Define an endpoint for getting pending questions count by community
app.get('/api/pendingQuestionsCountByCommunity', (req, res) => {
   // SQL query to fetch community statistics
  const query = `
    SELECT 
      community_name, 
      SUM(CASE WHEN answer = 'null' THEN 1 ELSE 0 END) AS pendingCount,
      SUM(CASE WHEN answer != 'null' THEN 1 ELSE 0 END) AS answeredCount,   
       SUM(Total_visitors) AS Total_visitors
    FROM 
      question_answer
    GROUP BY 
      Community_name
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
 // Log the query results to the console for debugging
    console.log(results);
    res.json(results);
  });
});



// Route to create a new comment
app.post('/comments', (req, res) => {
  const { text, parentId } = req.body;
  const userid = req.session.userid;
  const insertQuery = 'INSERT INTO comments (IJST_ID,text, parentId) VALUES (?, ?, ?)';
  db.query(insertQuery, [userid,text, parentId], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'An error occurred while adding the comment' });
    }
    const newCommentId = results.insertId;
    const selectQuery = 'SELECT * FROM comments WHERE id = ?';
    db.query(selectQuery, [newCommentId], (selectError, selectResults) => {
      if (selectError) {
        console.error(selectError);
        return res.status(500).json({ error: 'An error occurred while retrieving the new comment' });
      }
      res.status(201).json(selectResults[0]);
    });
  });
});

app.get('/api/username', (req, res) => {
  const userid = req.session.userid; // Check the session contains a user ID
  const query = `SELECT name FROM users WHERE IJST_ID = ?`;
  // Execute the query
  db.query(query, [userid], (err, results) => {
    if (err) {
      console.error('Error querying MySQL:', err);
      res.status(500).json({ error: 'Database error' });
      return;
    }

    if (results.length === 0) {
      
      res.status(404).json({ error: 'User not found' });
    } else {
      console.log(results)
       // User found, send back the name
      res.json({ name: results[0].name });
    }
  });
});


// Route to update a comment
app.put('/comments/:id', (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const updateQuery = 'UPDATE comments SET text = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?';
  db.query(updateQuery, [text, id], (error) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'An error occurred while updating the comment' });
    }
    const selectQuery = 'SELECT * FROM comments WHERE id = ?';
db.query(selectQuery, [id], (selectError, selectResults) => {
      if (selectError) {
        console.error(selectError);
        return res.status(500).json({ error: 'An error occurred while retrieving the updated comment' });
      }
      res.status(200).json(selectResults[0]);
    });
  });
});

// Route to delete a comment
app.delete('/comments/:id', (req, res) => {
  const { id } = req.params;
  const deleteQuery = 'DELETE FROM comments WHERE id = ?';
  db.query(deleteQuery, [id], (error) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'An error occurred while deleting the comment' });
    }
    res.status(204).send();
  });
});
// POST endpoint to increment visitor count
app.post('/api/trending-question-count', (req, res) => {
  const { question } = req.body;
  console.log('Received request to update count for question:', question); // Logging the received question

  const updateQuery = `
      UPDATE question_answer
      SET trending_question_count = trending_question_count + 1
      WHERE question = ?;
  `;
  
  db.query(updateQuery, [question], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).send(err);
    } else if (results.affectedRows === 0) {
      console.log('No rows updated, question not found.');
      res.status(404).send('Question not found');
    } else {
      console.log('Question count updated successfully for:', question);
      res.send('Question count updated successfully');
    }
  });
});


app.get('/api/top-trending-questions', (req, res) => {
  const communityName = req.query.communityName;  // Get the community name from the query parameters

  const fetchQuery = `
    SELECT question
    FROM question_answer
    WHERE Community_name = ?
    ORDER BY trending_question_count DESC
    LIMIT 5;
  `;

  db.query(fetchQuery, [communityName], (err, results) => {
    if (err) {
      console.error('Error fetching top trending questions:', err);
      res.status(500).send('Error fetching top trending questions');
    } else {
      console.log(results);
      res.json(results);  // Send JSON response with top trending questions
    }
  });
});

// POST endpoint to increment visitor count
app.post('/api/increment-visitor', (req, res) => {
  const { communityName } = req.body;

  // Update the Total_visitors count for the specified community
  const sql = 'UPDATE question_answer SET Total_visitors = Total_visitors + 1 WHERE Community_name = ?';

  db.query(sql, [communityName], (err, result) => {
    if (err) {
      console.error('Error updating visitor count:', err);
      return res.status(500).json({ error: 'Failed to update visitor count' });
    }
    console.log(`Visitor count updated for ${communityName}`);
    res.json({ message: 'Visitor count updated successfully' });
  });
});

// Update answer route
app.put('/api/updateAnswer', (req, res) => {
  const { question, answer } = req.body;
  console.log(question, answer);
  const sql = 'UPDATE question_answer SET answer = ? WHERE question = ?';
  db.query(sql, [answer, question], (err, result) => {
      if (err) {
          console.error('Error updating answer:', err);
          res.status(500).json({ error: 'Failed to update answer' });
      } else {
          console.log('Answer updated successfully', result);
          res.json({ message: 'Answer updated successfully' });
      }
  });
});



///////// Publish Book /////////////////////////////////////////////////////////////

app.use("/public/bookpdf",express.static("bookpdf"))

const bookstorage = multer.diskStorage({
  destination: function (req, file, cb) { //useruploading file here
    cb(null, "./public/bookpdf");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }

});

// // Serve static PDF files from the 'uploads' folder
 app.use('/public/bookpdf', express.static(path.join(__dirname, 'public/bookpdf')));

const uploadbook = multer({ storage:bookstorage })

app.post('/submitBook', uploadbook.fields([
  { name: 'bookfile', maxCount: 1 },
  { name: 'coverLetterFile', maxCount: 1 },
  { name: 'bookFilePlagiarism', maxCount: 1 }
]), (req, res) => {
  // Ensure that user is authenticated and session contains userid
  if (!req.session.userid) {
    return res.status(401).send("Unauthorized");
  }
  const IJST_ID = req.session.userid;
  const book_title = req.body. bookTitle;
  const technologies = req.body.selectedTechnology;
  const submission_date = new Date(); // Assuming submission_date is the current date and time
  const mla_citation = req.body.mlaCitation;
  const apa_citation = req.body.apaCitation;
  const chicago_citation = req.body.chicagoCitation;
  const harvard_citation = req.body.harvardCitation;
  const vancouver_citation = req.body.vancouverCitation;

  console.log('Files Uploaded:', req.files); // Log uploaded files
  console.log('Body:', book_title); // Log request body
  
  // Error handling to check if files were uploaded and correct field names were used
  if (!req.files || !req.files['bookfile'] || !req.files['coverLetterFile'] || !req.files['bookFilePlagiarism']) {
    console.log("Error: No files uploaded or incorrect field names.");
    return res.status(400).send("Error: No files uploaded or incorrect field names.");
  }
  const bookfilePath = req.files['bookfile'][0].path.replace(/\\/g, '/');
  const coverLetterFilePath = req.files['coverLetterFile'][0].path.replace(/\\/g, '/');
  const bookFilePlagiarismPath = req.files['bookFilePlagiarism'][0].path.replace(/\\/g, '/');

  const bookfileName = req.files['bookfile'][0].filename;
  const coverLetterFileName = req.files['coverLetterFile'][0].filename;
  const bookFilePlagiarismName = req.files['bookFilePlagiarism'][0].filename;

  // Log file paths
  console.log("book file Path:", bookfilePath);
  console.log("Cover Letter File Path:", coverLetterFilePath);
  console.log("Paper File plagiarism Path:", bookFilePlagiarismPath);

  // Log file filenames
  console.log("book file filename: " + bookfileName);
  console.log("Cover Letter File filename: " + coverLetterFileName);
  console.log("Paper File plagiarism filename: " + bookFilePlagiarismName);

  // Values to be inserted into the table
  const values = [
    IJST_ID,
    submission_date,
    book_title,
    technologies,
    coverLetterFileName,
    coverLetterFilePath,
    bookfileName,
    bookfilePath,
    bookFilePlagiarismName,
    bookFilePlagiarismPath,
    mla_citation,
    apa_citation,
    chicago_citation,
    harvard_citation,
    vancouver_citation
  ];

  const insertQuery = `
    INSERT INTO submitBook (
      IJST_ID, submission_date, book_title, technologies, cover_name, cover_path, book_name, book_path,
      book_plagiarism_name, book_plagiarism_path,
      mla_citation, apa_citation, chicago_citation, harvard_citation, vancouver_citation
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  // Execute the insert query
  db.query(insertQuery, values, (error, results, fields) => {
    if (error) {
      console.error("Error inserting data into submitPaper table:", error);
      return res.status(500).send("Error inserting data into submitPaper table.");
    }
    console.log("Data inserted into submitPaper table successfully.");
    res.send('Files uploaded and data inserted into submitPaper table successfully.');
  });
});
// Error handling middleware for unexpected errors
app.use((err, req, res, next) => {
  console.error('Unexpected error:', err);
  res.status(500).send('Unexpected error occurred.');
});

app.get('/BookInreview', (req, res) => {
  const selectQuery = `
    SELECT  book_title, book_name, bid, submission_date, status,
           Reviewer_1_comments, Reviewer_2_comments, user_comments,
           book_path, Reviewer_1_UserCommen, Reviewer_2_UserCommen
    FROM submitBook
    WHERE IJST_ID = ?`;
  const values = [req.session.userid];
  db.query(selectQuery, values, (error, results) => {
    if (error) {
      console.error('Error fetching papers:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    console.log('Fetched papers:', results);
    if (results.length === 0) {
      console.log('No papers found for the user');
      return res.status(404).json({ error: 'No papers found' });
    }
    res.json(results);
  });
});


app.post('/postComment', (req, res) => {
  const { bookId, userComments } = req.body;

  // const updateQuery = 'UPDATE submitPaper SET user_comments = ? WHERE pid = ?';
  const updateQuery = 'UPDATE submitBook SET user_comments = ? WHERE bid = ?';


  const values = [userComments, bookId];

  db.query(updateQuery, values, (error, results) => {
    if (error) {
      console.error('Error posting comment:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    console.log('Comment posted successfully');
    res.json({ success: true });
  });
});


app.post('/deleteComment', (req, res) => {
  const { bookId } = req.body;
  db.query('UPDATE submitBook SET user_comments = NULL WHERE bid = ?', [bookId], (error, results) => {
    if (error) {
      res.status(500).send('Failed to delete comment');
    } else {
      res.send('Comment deleted successfully');
    }
  });
});

app.post('/deleteReviewer1UserComment', (req, res) => {
  const { bookId } = req.body;
  db.query('UPDATE submitBook SET Reviewer_1_UserCommen = NULL WHERE bid = ?', [bookId], (error, results) => {
    if (error) {
      res.status(500).send('Failed to delete Reviewer 1 user comment');
    } else {
      res.send('Reviewer 1 user comment deleted successfully');
    }
  });
});

app.post('/deleteReviewer2UserComment', (req, res) => {
  const { bookId } = req.body;
  db.query('UPDATE submitBook SET Reviewer_2_UserCommen = NULL WHERE bid = ?', [bookId], (error, results) => {
    if (error) {
      res.status(500).send('Failed to delete Reviewer 2 user comment');
    } else {
      res.send('Reviewer 2 user comment deleted successfully');
    }
  });
});
app.post('/postReply', (req, res) => {
  const { bookId, reviewer, reply } = req.body;
  const column = reviewer === 'reviewer1' ? 'Reviewer_1_UserCommen' : 'Reviewer_2_UserCommen';
  db.query(`UPDATE submitBook SET ${column} = ? WHERE bid = ?`, [reply, bookId], (error, results) => {
    if (error) {
      res.status(500).send('Failed to post reply');
    } else {
      res.send('Reply posted successfully');
    }
  });
});


/////////////////////////////// THIS IS FOR All Pending Book Requests ////////////////////////////////////////////////////////////


app.get('/BookunderPublishing', (req, res) => {
  const selectQuery = `
    SELECT 
      bid,
      book_title, 
      technologies, 
      cover_path, 
      book_path, 
      book_plagiarism_path,
      first_reviewer,
      second_reviewer
    FROM submitBook `;
  
  // Execute the query
  db.query(selectQuery, (error, results) => {
    if (error) {
      console.error('Error fetching papers:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    // Log the fetched results for debugging
    console.log('Fetched books:', results);

    // Check if any books were found
    if (results.length === 0) {
      console.log('No books found for the user');
      return res.status(404).json({ error: 'No books found' });
    }
    // Send the books data as JSON response
    res.json(results);
  });
});



// Define your endpoint to fetch reviewer information
app.get('/Book-getLoggedInUserId', (req, res) => {
  const query = `
    SELECT DISTINCT first_reviewer AS IJST_ID, first_reviewer AS name FROM submitBook 
    UNION
    SELECT DISTINCT second_reviewer AS IJST_ID, second_reviewer AS name FROM submitBook `;
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching reviewers:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    const reviewerInfo = {};
    results.forEach(reviewer => {
      reviewerInfo[reviewer.id] = reviewer.name;
    });
    res.json(reviewerInfo);
  });
});


// Define your endpoint to save selected reviewer
app.post('/Book-saveSelectedReviewer', (req, res) => {
  const { bookId, reviewer } = req.body;
  const reviewerId = req.session.userid;

  if (!reviewerId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  let columnToUpdate;
  if (reviewer === 'reviewer1') {
    columnToUpdate = 'first_reviewer';
  } else if (reviewer === 'reviewer2') {
    columnToUpdate = 'second_reviewer';
  } else {
    return res.status(400).json({ error: 'Invalid reviewer' });
  }

  const query = `
    UPDATE submitBook 
    SET ${columnToUpdate} = ?
    WHERE bid = ? AND (${columnToUpdate} IS NULL OR ${columnToUpdate} = '')
  `;

  const values = [reviewerId, bookId];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error('Error updating selected reviewer:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    console.log('Selected reviewer updated successfully');
    res.status(200).json({ message: 'Selected reviewer updated successfully' });
  });
});


//05-06-24
app.post('/Book-saveReviewDecision', (req, res) => {
  const { bookId, reviewer, decision, type } = req.body;
  const reviewerId = req.session.userid;

  if (!reviewerId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!['approve', 'reject'].includes(decision)) {
    return res.status(400).json({ error: 'Invalid decision' });
  }

  let decisionColumn = '';

  if (type === 'cover_letter') {
    switch (reviewer) {
      case 'reviewer1':
        decisionColumn = 'cover_letterDecesion1';
        break;
      case 'reviewer2':
        decisionColumn = 'cover_letterDecesion2';
        break;
      default:
        return res.status(400).json({ error: 'Invalid reviewer' });
    }
  } else if (type === 'book') {
    switch (reviewer) {
      case 'reviewer1':
        decisionColumn = 'book_Decesion1';
        break;
      case 'reviewer2':
        decisionColumn = ' book_Decesion2';
        break;
      default:
        return res.status(400).json({ error: 'Invalid reviewer' });
    }
  } else if (type === 'plagiarism_report') {
    switch (reviewer) {
      case 'reviewer1':
        decisionColumn = 'book_plagiarismDecesion1';
        break;
      case 'reviewer2':
        decisionColumn = 'book_plagiarismDecesion2';
        break;
      default:
        return res.status(400).json({ error: 'Invalid reviewer' });
    }
  } else {
    return res.status(400).json({ error: 'Invalid decision type' });
  }

  // Update the decision column only
  const updateDecisionQuery = `
    UPDATE submitBook
    SET ${decisionColumn} = ?
    WHERE bid = ?
  `;

  const values = [decision, bookId];

  db.query(updateDecisionQuery, values, (error, results) => {
    if (error) {
      console.error('Error updating review decision:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const checkStatusQuery = `
      SELECT
        cover_letterDecesion1, book_Decesion1, book_plagiarismDecesion1,
        cover_letterDecesion2, book_Decesion2, book_plagiarismDecesion2
      FROM submitBook
      WHERE bid = ?
    `;

    db.query(checkStatusQuery, [bookId], (error, results) => {
      if (error) {
        console.error('Error fetching decision statuses:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      const decisions = results[0];
      const decisionsArray = Object.values(decisions);

      if (decisionsArray.every(decision => decision)) {
        const status = decisionsArray.includes('reject') ? 'Rejected' : 'Approved';

        const updateStatusQuery = `
          UPDATE submitBook 
          SET status = ?
          WHERE bid = ?
        `;

        db.query(updateStatusQuery, [status, bookId], (error, results) => {
          if (error) {
            console.error('Error updating status:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          console.log('Review decision and status updated successfully');
          res.status(200).json({ message: 'Review decision and status updated successfully' });
        });
      } else {
        console.log('Review decision saved successfully');
        res.status(200).json({ message: 'Review decision saved successfully' });
      }
    });
  });
});


app.post('/Book-saveComments', (req, res) => {
  const { bookId, reviewer, comments, type } = req.body;
  const reviewerId = req.session.userid;

  if (!reviewerId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  let commentsColumn = '';

  if (type === 'cover_letter') {
    switch (reviewer) {
      case 'reviewer1':
        commentsColumn = 'Reviewer_1_comments';
        break;
      case 'reviewer2':
        commentsColumn = 'Reviewer_2_comments';
        break;
      default:
        return res.status(400).json({ error: 'Invalid reviewer' });
    }
  } else if (type === 'book') {
    switch (reviewer) {
      case 'reviewer1':
        commentsColumn = 'Reviewer_1_comments';
        break;
      case 'reviewer2':
        commentsColumn = 'Reviewer_2_comments';
        break;
      default:
        return res.status(400).json({ error: 'Invalid reviewer' });
    }
  } else if (type === 'plagiarism_report') {
    switch (reviewer) {
      case 'reviewer1':
        commentsColumn = 'Reviewer_1_comments';
        break;
      case 'reviewer2':
        commentsColumn = 'Reviewer_2_comments';
        break;
      default:
        return res.status(400).json({ error: 'Invalid reviewer' });
    }
  } else {
    return res.status(400).json({ error: 'Invalid decision type' });
  }

  // Update the comments column
  const updateCommentsQuery = `
    UPDATE submitBook 
    SET ${commentsColumn} = ?
    WHERE bid = ?
  `;

  const values = [comments, bookId];

  db.query(updateCommentsQuery, values, (error, results) => {
    if (error) {
      console.error('Error updating comments:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    console.log('Comments updated successfully');
    res.status(200).json({ message: 'Comments updated successfully' });
  });
});




///////////////////////////// Admin side Technology  //////////////////////////////////////////////////


app.post('/technology', (req, res) => {
  const { technologyName } = req.body;
  console.log('Request received:',technologyName );

  const insertQuery = `
    INSERT INTO paper_technology (technologyName )
    VALUES (?)
  `;

  db.query(insertQuery, [technologyName], (error, results) => {
    if (error) {
      console.error("Error inserting data into technology table:", error);
      return res.status(500).send("Error inserting data into technology table.");
    }
    res.send('Data inserted into technology table successfully.');
  });
});

// Endpoint to get technology names
app.get('/api/technology', (req, res) => {
  const sql = 'SELECT technologyName FROM paper_technology';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

// Correct route URL for updating technology
app.post('/technology/update-technology', (req, res) => {
  // Extract new technology name and existing technology name from request body
  const newTechnologyName = req.body.NewTechnologyName;
  const technologyName = req.body.technologyName;

  // SQL query to update the technology name in the table
  const updateQuery = `
    UPDATE paper_technology
    SET technologyName = ?
    WHERE technologyName = ?`;

  // Data to be used in the SQL query
  const queryData = [newTechnologyName, technologyName];

  // Execute the SQL query
  db.query(updateQuery, queryData, (error, results) => {
    if (error) {
      // Log error and send a 500 response if there's an error in the query execution
      console.error("Error updating data in technology table:", error);
      return res.status(500).send("Error updating data in technology table.");
    }

    // Check if any rows were affected (i.e., updated)
    if (results.affectedRows > 0) {
      res.send('Technology updated successfully.');
    } else {
      // Send a 404 response if no rows were updated (i.e., technology name not found)
      res.status(404).send('Technology not found.');
    }
  });
});

// Route to handle deleting a technology
app.post('/technology/delete-technology', (req, res) => {
  const { technologyName } = req.body;
  console.log("Request to delete:", req.body);

  const deleteQuery = 'DELETE FROM paper_technology WHERE technologyName = ?';

  db.query(deleteQuery, [technologyName], (error, results) => {
    if (error) {
      console.error('Error deleting technology:', error);
      return res.status(500).send('Error deleting technology.');
    }
    if (results.affectedRows > 0) {
      res.send('Technology deleted successfully.');
    } else {
      res.status(404).send('Technology not found.');
    }
  });
});

// Route to handle deactivating a technology
app.post('/api/deactivate-technology', (req, res) => {
  const { technologyName, status } = req.body;

  if (!req.session.userid) {
    return res.status(401).send("Unauthorized");
  }

  const updateQuery = 'UPDATE paper_technology SET status = ? WHERE technologyName = ?';

  db.query(updateQuery, [status, technologyName], (error, results) => {
    if (error) {
      console.error('Error updating status of technology:', error);
      return res.status(500).send('Error updating status of technology.');
    }

    if (results.affectedRows > 0) {
      res.send('Technology status updated successfully.');
    } else {
      res.status(404).send('Technology not found.');
    }
  });
});
///////////////////////////// Admin side Industry  //////////////////////////////////////////////////
app.post('/industry', (req, res) => {
  const { industryName } = req.body;
  console.log('Request received:', industryName);

  if (!industryName) {
    return res.status(400).send('Industry Name is required.');
  }

  const insertQuery = `
    INSERT INTO paper_industry (industryName)
    VALUES (?)
  `;

  db.query(insertQuery, [industryName], (error, results) => {
    if (error) {
      console.error('Error inserting data into industry table:', error);
      return res.status(500).send('Error inserting data into industry table.');
    }
    res.send('Data inserted into industry table successfully.');
  });
});



// Endpoint to get industry names
app.get('/api/industry', (req, res) => {
  const sql = 'SELECT industryName FROM paper_industry';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

// Correct route URL for updating industry
app.post('/industry/update-industry', (req, res) => {
  // Extract new industry name and existing industry name from request body
  const newIndustryName = req.body.NewIndustryName;
  const industryName = req.body.industryName;

  // SQL query to update the industry name in the table
  const updateQuery = `
    UPDATE paper_industry
    SET industryName = ?
    WHERE industryName = ?`;

  // Data to be used in the SQL query
  const queryData = [newIndustryName, industryName];

  // Execute the SQL query
  db.query(updateQuery, queryData, (error, results) => {
    if (error) {
      // Log error and send a 500 response if there's an error in the query execution
      console.error("Error updating data in industry table:", error);
      return res.status(500).send("Error updating data in industry table.");
    }

    // Check if any rows were affected (i.e., updated)
    if (results.affectedRows > 0) {
      console.log(results);
      // Send success response if the update was successful
      res.send('Industry updated successfully.');
    } else {
      // Send a 404 response if no rows were updated (i.e., industry name not found)
      res.status(404).send('Industry not found.');
    }
  });
});
app.post('/industry/delete-industry', (req, res) => {
  const { industryName } = req.body;
  console.log("Request to delete:", req.body);

  const deleteQuery = `DELETE FROM paper_industry WHERE industryName = ?`;

  db.query(deleteQuery, [industryName], (error, results) => {
    if (error) {
      console.error("Error deleting industry:", error);
      return res.status(500).send("Error deleting industry.");
    }
    if (results.affectedRows > 0) {
      res.send('Industry deleted successfully.');
    } else {
      res.status(404).send('Industry not found.');
    }
  });
});

app.post('/api/deactivate-industry', async (req, res) => {
  const { industryName, status } = req.body;

  if (!req.session.userid) {
    return res.status(401).send("Unauthorized");
  }

  const updateQuery = `UPDATE paper_industry SET status = ? WHERE industryName = ?`;

  db.query(updateQuery, [status, industryName], (error, results) => {
    if (error) {
      console.error("Error updating industry status:", error);
      return res.status(500).send("Error updating industry status.");
    }
    if (results.affectedRows > 0) {
      res.send('Industry status updated successfully.');
    } else {
      res.status(404).send('Industry not found.');
    }
  });
});


////////////////////////////////////////////////////////// forgot password ////////////////////////////////////////

// Endpoint to verify IJST ID
app.post('/api/verifyIjst', (req, res) => {
  const { IJST_ID } = req.body;

  if (!IJST_ID) {
    return res.status(400).json({ success: false, message: 'IJST ID is required' });
  }

  // SQL query to select user from database based on IJST_ID
  const query = "SELECT * FROM users WHERE IJST_ID = ?";
  db.query(query, [IJST_ID], (error, results) => {
    if (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

    if (results.length > 0) {
      return res.json({ success: true, message: 'IJST ID is valid' });
    } else {
      return res.json({ success: false, message: 'IJST ID is invalid' });
    }
  });
});



// Endpoint to update password
app.post('/api/updatePassword', async (req, res) => {
  const { IJST_ID, newPassword } = req.body;

  if (!IJST_ID || !newPassword) {
    return res.status(400).json({ success: false, message: 'IJST ID and new password are required' });
  }

 
  // SQL query to update user password
  const query = "UPDATE users SET password = ? WHERE IJST_ID = ?";
  db.query(query, [newPassword, IJST_ID], (error, results) => {
    if (error) {
      console.error('Database update error:', error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

    if (results.affectedRows > 0) {
      return res.json({ success: true, message: 'Password updated successfully' });
    } else {
      return res.json({ success: false, message: 'Failed to update password' });
    }
  });
});

///////////////////////////////////////////( NEWSLETTER ) Homefooter.jsx page ///////////////////////////////////////  

// API route to handle subscription
app.post('/api/subscribe', (req, res) => {
  const { email } = req.body;

  const query = 'INSERT INTO subscribers (email) VALUES (?)';
  db.query(query, [email], (err, result) => {
      if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
              return res.status(400).json({ message: 'Email is already subscribed.' });
          }
          return res.status(500).json({ message: 'Database error' });
      }
      
  // Send "Thank You for Subscribing" email
  console.log("Attempting to send Thank You email to:", email);
      sendThankYouEmail(email);

      
      res.status(200).json({ message: 'Subscription successful' });
  });
});

// Function to send "Thank You for Subscribing" email
const sendThankYouEmail = (email) => {
  // Setup nodemailer
  const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
       user: 'your email should write here ',
               pass: 'your-app-password-here'
      }
  });

  const mailOptions = {
      from: 'your email should write here ',
      to: email,
      subject: 'Thank You for Subscribing to IJST',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; text-align: center; padding: 20px; background-color: #f4f4f4;">
          <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #2e6da4;">Thank You for Subscribing!</h1>
            <p style="font-size: 16px; line-height: 1.5;">We're thrilled to have you on board! You'll now receive the latest updates and publications from IJST.</p>
            <p style="font-size: 16px; line-height: 1.5;">Stay tuned for exciting content and exclusive offers. We appreciate your interest and support.</p>
          </div>
          <p style="font-size: 12px; color: #999; margin-top: 20px;">If you did not subscribe to this website, please ignore this email.</p>
        </div>
      `
  };
  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.error('Error sending email:', error);
      } else {
          console.log('Thank You email sent:', info.response);
      }
  });
};


////////------------------------------------  CreateCoupons  ----------------------////////



// API endpoint to insert coupon data
app.post('/api/coupons', (req, res) => {
  const {
    code,
    description,
    discount_type,
    discount_amount,
    expiry_date,
    usage_limit_per_coupon,
    usage_limit_per_item,
    usage_limit_per_user,
    status,
    visibility,
    publish_date,
  } = req.body;

  const query = `
    INSERT INTO coupons (code,description, discount_type, discount_amount,
     expiry_date, usage_limit_per_coupon, usage_limit_per_item, usage_limit_per_user, status, visibility, publish_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      code,
      description,
      discount_type,
      discount_amount,
      expiry_date,
      usage_limit_per_coupon,
      usage_limit_per_item,
      usage_limit_per_user,
      status,
      visibility,
      publish_date,
    ],
    (err, result) => {
      if (err) {
        console.error('Error inserting coupon data:', err);
        res.status(500).json({ error: 'Failed to insert coupon data' });
      } else {
        res.status(201).json({ message: 'Coupon created successfully' });
      }
    }
  );
});

// Example backend endpoint for fetching coupons
app.post('/api/coupons/apply', (req, res) => {
  const { code } = req.body;
console.log(code);
  const query = `
    SELECT * FROM coupons
    WHERE code = ? AND status = 'Published' AND NOW() <= expiry_date
  `;

  db.query(query, [code], (err, results) => {
    if (err) {
      console.error('Error fetching coupon:', err);
      res.status(500).json({ error: 'Failed to fetch coupon data' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Coupon not found or expired' });
    } else {
      res.status(200).json({ coupon: results[0] });
      console.log(results);
    }
  });
});
// Example endpoint for applying coupon
app.post('/api/coupons/apply', (req, res) => {
  const { code } = req.body;
  const userId = req.user.id; // Assuming you have user authentication and can get user ID from the request

  db.query("SELECT * FROM coupons WHERE code = ?", [code], (err, couponRows) => {
    if (err) {
      return res.status(500).json({ error: "Error applying coupon" });
    }

    if (!couponRows.length) {
      return res.status(400).json({ error: "Invalid coupon code" });
    }

    const coupon = couponRows[0];

    // Check if coupon is active
    if (coupon.status !== 'active') {
      return res.status(400).json({ error: "Coupon is not active" });
    }

    // Check expiry date
    const currentDate = new Date();
    if (new Date(coupon.expiry_date) < currentDate) {
      return res.status(400).json({ error: "Coupon has expired" });
    }

    // Check usage limits
    db.query(
      "SELECT COUNT(*) AS usageCount FROM coupon_usage WHERE coupon_code = ? AND user_id = ?",
      [code, userId],
      (err, usageResult) => {
        if (err) {
          return res.status(500).json({ error: "Error checking coupon usage" });
        }

        const usageCount = usageResult[0].usageCount;

        if (coupon.usage_limit_per_user !== null && usageCount >= coupon.usage_limit_per_user) {
          return res.status(400).json({ error: "Coupon usage limit exceeded for this user" });
        }

        // Respond with discount amount
        res.json({
          discountAmount: coupon.discount_amount,
        });
      }
    );
  });
});





//------------------------------------------------code for Paper Publishing on Admin side-------------------------------//
app.get('/UnderPublishing', (req, res) => {
  const selectQuery = `
    SELECT IJST_ID, submission_date, pid, paper_title, technologies, cover_name, cover_path,
           paper_name, paper_path, paper_plagiarism_name, paper_plagiarism_path, status,
           first_reviewer, second_reviewer, cover_letterDecesion1, paper_Decesion1,
           paper_plagiarismDecesion1, cover_letterDecesion2, paper_Decesion2,
           paper_plagiarismDecesion2, Reviewer_1_comments, Reviewer_2_comments,
           user_comments, Reviewer_1_UserCommen, Reviewer_2_UserCommen, citations,
           mla_citation, apa_citation, chicago_citation, harvard_citation, vancouver_citation,
           publishing_status
    FROM submitpaper
    WHERE status = 'Approved'`;
  const values = [req.session.userid];

  db.query(selectQuery, values, (error, results) => {
    if (error) {
      console.error('Error fetching approved papers:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    console.log('Fetched approved papers:', results);

    if (results.length === 0) {
      console.log('No approved papers found for the user');
      return res.status(404).json({ error: 'No approved papers found' });
    }

    res.json(results);
  });
});




//-------------------------------------------code for IJST-Approval Pages Paper Approval--------------------------------------------------------------------//
// Route to handle PDF file upload and update publishing status
app.post('/uploadApproval/:pid', upload.single('file'), (req, res) => {
  const pid = req.params.pid;
  const filePath =`/public/files/${req.file.filename}`;

  // Update the database with the file path and change the publishing status
  const updateQuery = `
    UPDATE submitpaper
    SET IJST_approval = ?, publishing_status = 'Published'
    WHERE pid = ?`;

  db.query(updateQuery, [filePath, pid], (err, result) => {
    if (err) {
      console.error('Error updating database:', err);
      res.status(500).send('Error updating the paper status.');
    } else {
      res.send('Paper approved and published successfully.');
    }
  });
});

app.listen(3000, () => {
  console.log("Listening");
});
