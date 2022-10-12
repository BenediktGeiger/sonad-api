import fs from 'node:fs';

let isDockerCached: boolean;

const hasDockerEnv = () => {
	try {
		fs.statSync('/.dockerenv');
		return true;
	} catch {
		return false;
	}
};

const hasDockerCGroup = () => {
	try {
		return fs.readFileSync('/proc/self/cgroup', 'utf8').includes('docker');
	} catch {
		return false;
	}
};

export default function isDocker() {
	if (isDockerCached === undefined) {
		isDockerCached = hasDockerEnv() || hasDockerCGroup();
	}

	return isDockerCached;
}
