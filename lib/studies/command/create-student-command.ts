import { Command } from '@lib/shared/bus/command.interface';
import { Student } from '../domain/student';

export class StudentCreateCommand implements Command {
	_type = 'command';
	#student: Student;

	constructor(student: Student) {
		this.#student = student;
	}

	get student() {
		return this.#student;
	}
}
