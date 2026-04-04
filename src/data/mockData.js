 // Mock data for the Startup Management System

export const departments = [
  { did: 1, dname: "Computer Engineering" },
  { did: 2, dname: "Electrical Engineering" },
  { did: 3, dname: "Mechanical Engineering" },
  { did: 4, dname: "Civil Engineering" },
  { did: 5, dname: "Information Technology" },
];

export const students = [
  { id: 1, name: "Aarav Patel", did: 1, year: 3, email: "aarav@bvm.edu" },
  { id: 2, name: "Priya Sharma", did: 1, year: 3, email: "priya@bvm.edu" },
  { id: 3, name: "Rohan Mehta", did: 2, year: 2, email: "rohan@bvm.edu" },
  { id: 4, name: "Sneha Gupta", did: 5, year: 4, email: "sneha@bvm.edu" },
  { id: 5, name: "Vikram Singh", did: 3, year: 3, email: "vikram@bvm.edu" },
  { id: 6, name: "Ananya Desai", did: 1, year: 2, email: "ananya@bvm.edu" },
  { id: 7, name: "Arjun Reddy", did: 4, year: 3, email: "arjun@bvm.edu" },
  { id: 8, name: "Ishita Joshi", did: 5, year: 4, email: "ishita@bvm.edu" },
  { id: 9, name: "Karan Malhotra", did: 2, year: 2, email: "karan@bvm.edu" },
  { id: 10, name: "Meera Nair", did: 1, year: 3, email: "meera@bvm.edu" },
];

export const startups = [
  { sid: 1, sname: "EduTech Solutions", description: "AI-powered learning platform", founded: "2024-01" },
  { sid: 2, sname: "GreenEnergy Labs", description: "Renewable energy solutions", founded: "2023-08" },
  { sid: 3, sname: "HealthFirst AI", description: "Healthcare analytics platform", founded: "2024-03" },
  { sid: 4, sname: "AgriSmart", description: "Smart farming technology", founded: "2023-11" },
  { sid: 5, sname: "FinEdge", description: "Fintech for students", founded: "2024-06" },
];

export const teams = [
  { tid: 1, tname: "Alpha Innovators" },
  { tid: 2, tname: "Green Warriors" },
  { tid: 3, tname: "Health Hackers" },
  { tid: 4, tname: "Agri Pioneers" },
  { tid: 5, tname: "FinTech Stars" },
  { tid: 6, tname: "Code Crusaders" },
];

export const startteams = [
  { tid: 1, mid: 1, sid: 1 },
  { tid: 1, mid: 2, sid: 1 },
  { tid: 2, mid: 3, sid: 2 },
  { tid: 2, mid: 5, sid: 2 },
  { tid: 3, mid: 4, sid: 3 },
  { tid: 3, mid: 8, sid: 3 },
  { tid: 4, mid: 6, sid: 4 },
  { tid: 5, mid: 7, sid: 5 },
  { tid: 5, mid: 9, sid: 5 },
  { tid: 6, mid: 10, sid: 1 },
];

export const instructors = [
  { iid: 1, iname: "Dr. Kirti Sharma", specialization: "Database Systems" },
  { iid: 2, iname: "Prof. Hemant Vasava", specialization: "Machine Learning" },
  { iid: 3, iname: "Dr. Anjali Mehta", specialization: "Cloud Computing" },
  { iid: 4, iname: "Prof. Rajesh Kumar", specialization: "IoT" },
  { iid: 5, iname: "Dr. Sunita Patel", specialization: "Data Science" },
];

export const tinstrs = [
  { tid: 1, iid: 1 },
  { tid: 1, iid: 2 },
  { tid: 2, iid: 3 },
  { tid: 3, iid: 2 },
  { tid: 3, iid: 5 },
  { tid: 4, iid: 4 },
  { tid: 5, iid: 1 },
  { tid: 6, iid: 3 },
];

export const funds = [
  { fid: 1, tid: 1, investor: "TechVentures Capital", amount: 500000, date: "2024-02-15" },
  { fid: 2, tid: 1, investor: "Angel Fund India", amount: 250000, date: "2024-06-10" },
  { fid: 3, tid: 2, investor: "GreenFuture VC", amount: 750000, date: "2024-03-20" },
  { fid: 4, tid: 3, investor: "HealthTech Fund", amount: 300000, date: "2024-04-05" },
  { fid: 5, tid: 4, investor: "Agri Innovations", amount: 200000, date: "2024-05-18" },
  { fid: 6, tid: 5, investor: "FinStart Capital", amount: 1000000, date: "2024-07-01" },
  { fid: 7, tid: 2, investor: "EcoInvest Partners", amount: 400000, date: "2024-08-12" },
  { fid: 8, tid: 1, investor: "Startup India Grant", amount: 100000, date: "2024-09-01" },
];

export const exhibitions = [
  { eid: 1, ex_name: "TechExpo 2024", ex_date: "2024-03-15", ex_place: "BVM Auditorium" },
  { eid: 2, ex_name: "Innovation Summit", ex_date: "2024-06-20", ex_place: "Ahmedabad Convention Center" },
  { eid: 3, ex_name: "Startup Showcase", ex_date: "2024-09-10", ex_place: "IIT Gandhinagar" },
  { eid: 4, ex_name: "Hack-a-thon 2024", ex_date: "2024-11-05", ex_place: "NID Campus" },
];

export const teamExhibitions = [
  { tid: 1, eid: 1 },
  { tid: 1, eid: 2 },
  { tid: 2, eid: 1 },
  { tid: 3, eid: 2 },
  { tid: 3, eid: 3 },
  { tid: 4, eid: 3 },
  { tid: 5, eid: 4 },
  { tid: 6, eid: 1 },
  { tid: 6, eid: 4 },
];

export const evaluations = [
  { eid: 1, tid: 1, iid: 1, score: 92, remarks: "Excellent innovation and execution" },
  { eid: 2, tid: 1, iid: 2, score: 88, remarks: "Strong technical foundation" },
  { eid: 3, tid: 2, iid: 3, score: 85, remarks: "Good sustainability approach" },
  { eid: 4, tid: 3, iid: 2, score: 90, remarks: "Impressive AI integration" },
  { eid: 5, tid: 3, iid: 5, score: 87, remarks: "Needs market validation" },
  { eid: 6, tid: 4, iid: 4, score: 78, remarks: "Promising concept, needs refinement" },
  { eid: 7, tid: 5, iid: 1, score: 95, remarks: "Outstanding prototype" },
  { eid: 8, tid: 6, iid: 3, score: 82, remarks: "Good team coordination" },
];

export const users = [
  { uid: 1, username: "admin", password: "admin123", role: "Admin" },
  { uid: 2, username: "aarav", password: "pass123", role: "Student" },
  { uid: 3, username: "drkirti", password: "pass123", role: "Instructor" },
];