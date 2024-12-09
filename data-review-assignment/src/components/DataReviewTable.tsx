// components/DataReview.tsx
import { useEffect, useState } from "react";
import { Progress } from "@/src/components/ui/progress"
import { DataTable } from "@/src/components/DataTable";

interface ValidationError {
    message: string;
    severity: 'critical' | 'warning' | 'valid';
}

interface DataReviewRecord {
    id: string;
    name: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    zipcode: string;
    status: 'pending' | 'active';
    errors: {
        [key: string]: ValidationError;
    };
}


export default function DataReviewTable() {
    const [data, setData] = useState<DataReviewRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(13);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setProgress(0);
                const response = await fetch('/api/data');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                setProgress(33); 
                const jsonData = await response.json();
                setProgress(66); 
                setData(jsonData.records);
                setProgress(100); 
            } catch (err) {
                throw new Error('Error fetching data:');
            } finally {
                setLoading(false);
               
            }
        };

        fetchData();
    }, []);

    return (
        <div className="p-8 dark:bg-black dark:text-white">
            <div className="flex flex-col items-center mb-4 space-y-4">
                <h1 className="font-mono text-xl font-bold">DATA REVIEW</h1>
            </div>
            {loading ? <div className="flex justify-center"><Progress className="w-[200px]" value={progress} /></div> : (
                <>
                    <DataTable 
                        data={data}
                    />
                </>
            )}
        </div>
    );
}
