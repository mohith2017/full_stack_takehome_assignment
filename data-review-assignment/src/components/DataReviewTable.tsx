// components/DataReview.tsx

import { useEffect, useState } from "react";

export default function DataReviewTable() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/data');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const jsonData = await response.json();
                setData(jsonData);
            } catch (err) {
                throw new Error('Error fetching data:');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div style={{ margin: "20px" }}>
            <h1>Data Review</h1>
            {/* Candidates will replace this placeholder with table, tooltips, and modals */}
        
            {loading ? <div>Loading...</div> :
                <pre>{JSON.stringify(data, null, 2)}</pre>
            }
        </div>
    );
}
