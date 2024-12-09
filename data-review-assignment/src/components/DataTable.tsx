import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/ui/table"
import { Button } from "@/src/components/ui/button"

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
    status: 'pending' | 'active' | 'inactive';
    errors: {
        [key: string]: ValidationError;
    };
}

interface DataTableProps {
    data: DataReviewRecord[];
}

export function DataTable({ data}: DataTableProps) {
    const getCellColor = (value: string, validation: ValidationError) => {
        if (!validation) return <div className="font-mono text-xs bg-green-50 text-green-700 px-2 py-0.5">{value}</div>;
        if (validation.severity == "critical") {
            return <div className="font-mono text-xs border-2 border-red-500 bg-red-50 text-red-700 rounded-md px-2 py-0.5">{value}</div>;
        } else if (validation.severity == "warning") {
            return <div className="font-mono text-xs border-2 border-yellow-500 bg-yellow-50 text-yellow-700 rounded-md px-2 py-0.5">{value}</div>;
        } else {
            return <div className="font-mono text-xs border-2 border-green-500 bg-green-50 text-green-700 rounded-md px-2 py-0.5">{value}</div>;
        }
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Street</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Zipcode</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Error Summary</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((record) => (
                    <TableRow key={record.id}>
                        <TableCell>
                            {getCellColor(record.id, record.errors?.id)}            
                        </TableCell>
                        <TableCell>
                            {getCellColor(record.name, record.errors?.name)}
                        </TableCell>
                        <TableCell>
                            {getCellColor(record.email, record.errors?.email)}
                        </TableCell>
                        <TableCell>
                            {getCellColor(record.phone, record.errors?.phone)}
                        </TableCell>
                        <TableCell>
                            {getCellColor(record.street, record.errors?.street)}
                        </TableCell>
                        <TableCell>
                            {getCellColor(record.city, record.errors?.city)}
                        </TableCell>
                        <TableCell>
                            {getCellColor(record.zipcode, record.errors?.zipcode)}
                        </TableCell>
                        <TableCell>
                            {getCellColor(record.status, record.errors?.status)}
                        </TableCell>
                        <TableCell>
                            <Button 
                                variant="outline"
                            >
                                <div className="font-mono text-xs">Details</div>
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
} 
