import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { HttpError } from './errors/http-error';

import matchRoutes from './routes/match.route';
import adminMatchRoutes from './routes/admin/match.route';


//  IMPORT API ROUTES
import authRoutes from "./routes/auth.route";
import adminUserRoutes from "./routes/admin/user.route";
import scorecardRoutes from './routes/scorecard.route';
import adminScorecardRoutes from './routes/admin/scorecard.route';
import newsRoutes from './routes/news.route';
import adminNewsRoutes from './routes/admin/news.route';


const app: Application = express();

const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3003', 'http://localhost:3005'],
    optionsSuccessStatus: 200,
    credentials: true,
};

app.use(cors(corsOptions));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/admin/users', adminUserRoutes);

app.use('/api/matches', matchRoutes);
app.use('/api/admin/matches', adminMatchRoutes);

app.use('/api/scorecards', scorecardRoutes);
app.use('/api/admin/scorecards', adminScorecardRoutes);



// with your other routes:
app.use('/api/news', newsRoutes);
app.use('/api/admin/news', adminNewsRoutes);

app.get('/', (req: Request, res: Response) => {
    return res.status(200).json({ success: "true", message: "Welcome to the API" });
});


app.use((req: Request, res: Response) => {
    res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found` });
});
app.use((err: Error, req: Request, res: Response, next: Function) => {
    if (err instanceof HttpError) {
        return res.status(err.statusCode).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
});


export default app;