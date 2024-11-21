interface UTCDateFunction {
    (date: string | number | Date): string;
}

const UTCDate: UTCDateFunction = (date) => {
    return new Date(date).toISOString();
}

export default UTCDate;