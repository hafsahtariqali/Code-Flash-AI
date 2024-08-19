
const Snackbar = ({ message, visible }) => {
    return (
        <div
            className={`fixed bottom-4 right-4 p-4 bg-black text-white rounded-lg shadow-lg transition-opacity ${
                visible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transition: 'opacity 0.5s ease' }}
        >
            {message}
        </div>
    );
};

export default Snackbar;
