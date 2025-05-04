const express = require('express');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const PORT = process.env.PORT || 3000;

// Create HTTP server and attach Express app
const server = http.createServer(app);

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.POR, // Fixed typo from POR to PORT
    secure: true,
    auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Transporter verification failed:', error);
    } else {
        console.log('Transporter is ready to send emails');
    }
});

// MongoDB connection
const mongoURI = 'mongodb+srv://susixushxhcj:ieswvnFaF3DG0TPM@project.mnp1y.mongodb.net/project001?retryWrites=true&w=majority&appName=project';
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB Atlas connected successfully to project001'))
    .catch((error) => {
        console.error('MongoDB Atlas connection failed:', error.message);
        process.exit(1);
    });

// Schemas
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'staff', 'admin'], required: true }
});

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    course: { type: String },
    semester: { type: String },
    year: { type: String },
    department: { type: String },
    rollNumber: { type: String }
});

const attendanceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    course: { type: String },
    attendance: [{
        date: { type: String, required: true },
        status: { type: String, enum: ['Present', 'Absent'], required: true },
        courseCode: { type: String } // Added to link attendance to a course
    }]
});
const marksSchema = new mongoose.Schema({
    staffEmail: { type: String, required: true },
    courseCode: { type: String, required: true },
    assessmentType: { type: String, enum: ['Quiz', 'Midterm', 'Final', 'Assignment'], required: true },
    date: { type: String, required: true },
    marksRecords: [
        {
            studentEmail: { type: String, required: true },
            score: { type: Number, required: true },
            maxScore: { type: Number, required: true },
        },
    ],
});

// Models

const Attendance = mongoose.model('Attendance', attendanceSchema, 'attendence');
const User = mongoose.model('User', userSchema, 'chalk');
const Student = mongoose.model('Student', studentSchema, 'studentdata');
const Marks = mongoose.model('Marks', marksSchema, 'marksData');
// Send verification code
async function sendVerificationCode(email) {
    try {
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const mailOptions = {
            from: 'thakurjatin8882@gmail.com',
            to: email,
            subject: 'Verification Code',
            text: `Your verification code is: ${verificationCode}`
        };

        await transporter.sendMail(mailOptions);
        console.log('Verification email sent to:', email);
        return { success: true, code: verificationCode };
    } catch (error) {
        console.error('Nodemailer Error:', error.message);
        return { success: false, code: null };
    }
}

// Socket.IO
const io = new Server(server, {
    cors: {
        origin: '*', // Adjust to match your frontend's URL
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

const staffCourses = [
     
        { name: 'Introduction to Programming', code: 'CS101', credits: 4 },
        { name: 'Data Structures', code: 'CS201', credits: 3 },
        { name: 'Database Systems', code: 'CS301', credits: 3 },
        { name: 'Operating Systems', code: 'CS401', credits: 4 },
        { name: 'Web Development', code: 'CS501', credits: 3 }
    
];
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Handle getCourses event
    socket.on('getCourses', async (data) => {
        const { email } = data;
        console.log('Received getCourses for email:', email);

        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            socket.emit('coursesResponse', {
                success: false,
                message: 'Valid email is required'
            });
            return;
        }

        try {
            const student = await Student.findOne({ email });
            socket.emit('coursesResponse', {
                success: true,
                courses: student?.course
                    ? [{ name: student.course, code: 'CS101', credits: 4 }]
                    : []
            });
        } catch (error) {
            console.error('Courses fetch error:', error.message);
            socket.emit('coursesResponse', {
                success: false,
                message: 'Server error: ' + error.message
            });
        }
    });

    socket.on('deleteuser', async (data) => {
        const { email } = data;
        console.log('Received deleteuser for email:', email);
 const us=User.deleteOne({email})
 if(!us){
    socket.emit('userdeleted', { success: false, message: 'User not found' });
    return;
}
        const student = await Student
.findOneAnd
Delete({ email });
        if (!student) {
            socket.emit('userdeleted', { success: false, message: 'User not found' });
            return;
        }
        const attendance = await Attendance
.findOneAnd
Delete({ email });

        if (!attendance) {
            socket.emit('userdeleted', { success: false, message: 'User not found' });
            return;
        }
        const marks = await Marks
.findOneAndDelete({ 'marksRecords.studentEmail': email });

        if (!marks) {
            socket.emit('userdeleted', { success: false, message: 'User not found' });
            return;
        }
        socket.emit('userdeleted', { success: true, message: 'User deleted successfully' });
        console.log('User deleted successfully:', email);




    })
    // Handle getAttendance event
    socket.on('getAttendance', async (data) => {
        const { email } = data;
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            socket.emit('attendanceResponse', {
                success: false,
                message: 'Valid email is required'
            });
            return;
        }

        try {
            const attendance = await Attendance.findOne({ email });
            if (!attendance || !attendance.attendance.length) {
                socket.emit('attendanceResponse', {
                    success: false,
                    message: 'No attendance data found'
                });
                return;
            }
            const attendanceData = attendance.attendance.map((item) => ({
                date: item.date,
                status: item.status,
                courseCode: item.courseCode || 'N/A'
            }));

            
            socket.emit('attendanceResponse', {
                success: true,
                message: 'Attendance data retrieved successfully',
                attendance: attendanceData
            });
        } catch (error) {
            console.error('Attendance fetch error:', error.message);
            socket.emit('attendanceResponse', {
                success: false,
                message: 'Server error: ' + error.message
            });
        }
    });
    socket.on('getCourses', async (data) => {
        const { email } = data;
        console.log('Received getCourses for email:', email);
    
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            socket.emit('coursesResponse', {
                success: false,
                message: 'Valid email is required',
            });
            return;
        }
    
        try {
            const user = await User.findOne({ email }).lean();
            if (!user) {
                socket.emit('coursesResponse', {
                    success: false,
                    message: 'User not found',
                });
                return;
            }
    
            if (user.role === 'student') {
                const student = await Student.findOne({ email }).lean();
                socket.emit('coursesResponse', {
                    success: true,
                    courses: student?.course
                        ? [{ name: student.course, code: 'CS101', credits: 4 }]
                        : [],
                });
            } else if (user.role === 'staff') {
                const courses = staffCourses;
                console.log('Returning courses for staff:', courses);
                socket.emit('coursesResponse', {
                    success: true,
                    courses,
                });
            } else {
                socket.emit('coursesResponse', {
                    success: false,
                    message: 'Invalid user role',
                });
            }
        } catch (error) {
            console.error('Courses fetch error:', error.message);
            socket.emit('coursesResponse', {
                success: false,
                message: 'Server error: ' + error.message,
            });
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Login request body:', req.body);

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Valid email is required'
        });
    }

    if (!password) {
        return res.status(400).json({
            success: false,
            message: 'Password is required'
        });
    }

    try {
        const user = await User.findOne({ email }).lean();
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found. Please sign up first.'
            });
        }

        if (!user.password) {
            return res.status(500).json({
                success: false,
                message: 'No user password found. Please register first.'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'The email or password is not valid!'
            });
        }

        const role = user.role || (email.toLowerCase().includes('chitkarauniversity') ? 'student' : 'staff');
        if (!user.role) {
            await User.updateOne({ email }, { $set: { role } });
            console.log(`Assigned role ${role} to user ${email}`);
        }

        return res.json({
            success: true,
            message: 'Login successful',
            user: {
                name: user.name,
                email: user.email,
                role: role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Register endpoint
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    let role;

    console.log('Register request body:', req.body);

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Name, email, and password are required'
        });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Valid email is required'
        });
    }

    if (email.toLowerCase().includes('chitkarauniversity')) {
        role = 'student';
    } 
    
    else {
        role = 'staff';
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        const { success, code } = await sendVerificationCode(email);
        if (!success) {
            return res.status(500).json({
                success: false,
                message: 'Failed to send verification code'
            });
        }

        return res.json({
            success: true,
            message: 'Verification code sent to email',
            tempCode: code,
            tempData: { name, email, password, role }
        });
    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Verify endpoint
app.post('/verify', async (req, res) => {
    const { name, email, password, role, code, receivedCode } = req.body;

    console.log('Verify request body:', req.body);

    if (!name || !email || !password || !role || !code) {
        return res.status(400).json({
            success: false,
            message: 'Name, email, password, role, and code required'
        });
    }

    if (code !== receivedCode) {
        return res.status(400).json({
            verified: false,
            message: 'Invalid verification code'
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();

        if (role === 'student') {
            const student = new Student({ name, email });
            await student.save();
            console.log('Student record created:', { name, email });
        }

        console.log('User registered:', { name, email, role });
        res.json({
            verified: true,
            message: 'User verified and registered successfully',
            role
        });
    } catch (error) {
        console.error('MongoDB error:', error.message);
        if (error.code === 11000) {
            return res.status(400).json({
                verified: false,
                message: 'Email already registered'
            });
        }
        res.status(500).json({
            verified: false,
            message: 'Error processing user data'
        });
    }
});

//staff endpoint

// Fetch students for a course (for staff)

app.post('/staff/upload-marks', async (req, res) => {
    const { staffEmail, courseCode, assessmentType, date, marksRecords } = req.body;

    if (!staffEmail || !courseCode || !assessmentType || !date || !marksRecords || !Array.isArray(marksRecords)) {
        return res.status(400).json({
            success: false,
            message: 'Staff email, course code, assessment type, date, and marks records are required',
        });
    }

    try {
        const staff = await User.findOne({ email: staffEmail }).lean();
        if (!staff || staff.role !== 'staff') {
            return res.status(403).json({
                success: false,
                message: 'Invalid staff user',
            });
        }

       

        for (const record of marksRecords) {
            if (!record.studentEmail || typeof record.score !== 'number' || typeof record.maxScore !== 'number') {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid marks record format',
                });
            }
        }

        const marks = new Marks({
            staffEmail,
            courseCode,
            assessmentType,
            date,
            marksRecords,
        });
        await marks.save();

        res.json({
            success: true,
            message: 'Marks uploaded successfully',
        });
    } catch (error) {
        console.error('Upload marks error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error: ' + error.message,
        });
    }
});


app.get('/staff/get-students', async (req, res) => {
    const { staffEmail, courseCode } = req.query;

    if (!staffEmail || !courseCode) {
        return res.status(400).json({
            success: false,
            message: 'Staff email and course code are required',
        });
    }   
        const students = await Student.find({}).lean();
        console.log('Fetched students for course:', students);
        res.json({
            success: true,
            students: students.map((student) => ({
                name: student.name,
                email: student.email,
            })),
        });
    
    
});


// Upload attendance (for staff)
// Mock staff courses (should be defined in server.js)


app.post('/staff/upload-attendance', async (req, res) => {
    const { staffEmail, courseCode, date, attendanceRecords } = req.body;

    if (!staffEmail || !courseCode || !date || !attendanceRecords || !Array.isArray(attendanceRecords)) {
        return res.status(400).json({
            success: false,
            message: 'Staff email, course code, date, and attendance records are required'
        });
    }

    try {
        // Validate staff user
        const staff = await User.findOne({ email: staffEmail }).lean();
        if (!staff || staff.role !== 'staff') {
            return res.status(403).json({
                success: false,
                message: 'Invalid staff user'
            });
        }

        // Check if the staff teaches the course


        // Validate attendance records
        for (const record of attendanceRecords) {
            if (!record.studentEmail || !record.status || !['Present', 'Absent'].includes(record.status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid attendance record format'
                });
            }
        }

        // Update attendance for each student
        for (const record of attendanceRecords) {
            const student = await Student.findOne({ email: record.studentEmail }).lean();
            if (!student) {
                console.warn(`Student not found: ${record.studentEmail}`);
                continue;
            }

            await Attendance.findOneAndUpdate(
                { email: record.studentEmail },
                {
                    $set: { name: student.name, course: student.course },
                    $push: {
                        attendance: {
                            date,
                            status: record.status,
                            courseCode
                        }
                    }
                },
                { upsert: true }
            );
        }

        res.json({
            success: true,
            message: 'Attendance uploaded successfully'
        });
    } catch (error) {
        console.error('Upload attendance error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error: ' + error.message
        });
    }
});

// Update student profile endpoint

// Result endpoint
const calculateGrade = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B+';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
};
app.get('/admin/users', async (req, res) => {
    try {
        // Optional: Add middleware to ensure only admins can access this
        const users = await User.find({}).lean();
        res.json({
            success: true,
            users
        });
    } catch (error) {
        console.error('Fetch users error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error: ' + error.message
        });
    }
});
app.get('/student/result', async (req, res) => {
    const { email } = req.query;
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Valid email is required',
        });
    }

    try {
        const marks = await Marks.find({ 'marksRecords.studentEmail': email }).lean();
        if (!marks || marks.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No results found for this student',
            });
        }

        const results = marks.flatMap((mark) => {
            const course = staffCourses.find((c) => c.code === mark.courseCode);
            const studentRecord = mark.marksRecords.find((r) => r.studentEmail === email);
            if (!studentRecord || !course) return [];

            return [{
                course: course.name,
                semester: '3',
                grade: calculateGrade(studentRecord.score, studentRecord.maxScore),
                year: new Date(mark.date).getFullYear().toString(),
            }];
        });

        res.json({
            success: true,
            results,
        });
    } catch (error) {
        console.error('Fetch results error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error: ' + error.message,
        });
    }
});




// Courses endpoint
app.get('/student/courses', async (req, res) => {
    const { email } = req.query;
    try {
        const student = await Student.findOne({ email });
        res.json({
            success: true,
            courses: student?.course
                ? [{ name: student.course, code: 'CS101', credits: 4 }]
                : []
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Attendance endpoint

// Notice endpoint
app.get('/student/notice', async (req, res) => {
    const { email } = req.query;
    try {
        res.json({
            success: true,
            notices: [
                {
                    title: 'Exam Schedule Released',
                    date: '2025-04-15',
                    description: 'Mid-term exams for Semester 3 start on May 1, 2025.'
                },
                {
                    title: 'Campus Event',
                    date: '2025-04-10',
                    description: 'Join the Tech Fest on April 20, 2025, at the Main Auditorium.'
                }
            ]
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// attendence endpoint
app.get('/student/attendance', async (req, res) => {
    const { email } = req.query;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Valid email is required'
        });
    }

    try {
        const attendance = await Attendance.findOne({ email }).lean();
        if (!attendance || !attendance.attendance.length) {
            return res.status(404).json({
                success: false,
                message: 'No attendance data found'
            });
        }

        const attendanceData = attendance.attendance.map(item => ({
            date: item.date,
            status: item.status,
            courseCode: item.courseCode
        }));

        res.json({
            success: true,
            message: 'Attendance data retrieved successfully',
            attendance: attendanceData
        });
    } catch (error) {
        console.error('Fetch attendance error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error: ' + error.message
        });
    }
});
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));