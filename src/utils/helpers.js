export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
};

export const formatDateTime = (date) => {
    return new Date(date).toLocaleString();
}; 