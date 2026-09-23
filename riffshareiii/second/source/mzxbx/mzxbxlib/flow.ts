function MZXBX_waitForCondition(sleepMs: number, isDone: () => boolean, onFinish: () => void): void {
    if (isDone()) {
        onFinish();
    } else {
        setTimeout(() => {
            MZXBX_waitForCondition(sleepMs, isDone, onFinish);
        }, sleepMs);
    }
}

