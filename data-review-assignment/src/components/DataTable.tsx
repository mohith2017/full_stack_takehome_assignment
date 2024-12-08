interface ValidationError {
    message: string;
    severity: 'critical' | 'warning' | 'valid';
}

interface DataReviewRecord {
    id: number;
    name: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    zipcode: string;
    status: 'pending' | 'active' | 'inactive';
    errors: {
        [key: string]: ValidationError;
    };
}

interface DataTableProps {
    data: DataReviewRecord[];
}

export function DataTable({ data }: DataTableProps ) {
    return (
        <div> {data.map(record => (
            <div key={record.id}>
                {record.name} - {record.email}
            </div>
        ))}
        </div>
    )
}
