import cors from 'cors';

export default cors({
	origin: 'http://localhost:8081',
	optionsSuccessStatus: 200,
});
