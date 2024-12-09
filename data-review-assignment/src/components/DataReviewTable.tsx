// components/DataReview.tsx
import { useEffect, useState } from "react";
import { Progress } from "@/src/components/ui/progress"
import { ErrorSummaryDialog } from "@/src/components/ErrorSummaryDialog"
import { DataTable } from "@/src/components/DataTable";
import { Button } from "@/src/components/ui/button"
import { TableIcon } from "lucide-react"
import { saveAs } from 'file-saver';
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/src/components/ui/select";
import FilterAltIcon from "@mui/icons-material/FilterAlt"

type SelectedRow = {
    id: string;
    data: Record<string, string>;
    validations: Record<string, ValidationError>;
}

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
    const [selectedRow, setSelectedRow] = useState<SelectedRow>();
    const [modalOpen, setModalOpen] = useState(false);
    const [progress, setProgress] = useState(13)
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [severityFilter, setSeverityFilter] = useState<string>("all");

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

    const filteredData = data.filter(record => {
        if (statusFilter !== "all" && record.status !== statusFilter) return false;
        if (severityFilter === "all") return true;
        
        const hasErrorOfSeverity = (severity: string) => {
            return Object.values(record.errors).some(error => error.severity === severity);
        };

        switch (severityFilter) {
            case "critical":
                return hasErrorOfSeverity("critical");
            case "warning":
                return hasErrorOfSeverity("warning");
            case "valid":
                return !hasErrorOfSeverity("critical") && !hasErrorOfSeverity("warning");
            default:
                return true;
        }
    });

    const exportToCSV = () => {
        const headers = [
            'ID',
            'Name',
            'Email',
            'Phone',
            'Street',
            'City',
            'Zipcode',
            'Status',
            'Validation Errors'
        ];

        const csvRows = filteredData.map(record => {
            const errorMessages = Object.entries(record.errors)
                .map(([field, error]) => `${field}: ${error.message}`)
                .join('; ');

            return [
                record.id,
                record.name,
                record.email,
                record.phone,
                record.street,
                record.city,
                record.zipcode,
                record.status,
                errorMessages
            ];
        });

        const statusInfo = statusFilter !== 'all' ? `-${statusFilter}` : '';
        const severityInfo = severityFilter !== 'all' ? `-${severityFilter}` : '';
        const filename = `data-review${statusInfo}${severityInfo}-${new Date().toISOString().split('T')[0]}.csv`;

        const csvContent = [
            headers.join(','),
            ...csvRows.map(row => row.map(cell => 
                typeof cell === 'string' && (cell.includes(',') || cell.includes('"'))
                    ? `"${cell.replace(/"/g, '""')}"` 
                    : cell
            ).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, filename);
    };


    return (
        <div className="p-8 dark:bg-black dark:text-white">
            <div className="flex flex-col items-center mb-4 space-y-4">
                <h1 className="font-mono text-xl font-bold">DATA REVIEW</h1>
                <div className="w-full flex justify-between items-center">
                    <Button 
                        variant="outline" 
                        className="rounded-full"
                        onClick={exportToCSV}
                    >
                        <TableIcon className="w-4 h-4 mr-2" />
                        <span className="font-mono text-xs">Export CSV</span>
                    </Button>

                    <div className="flex items-center gap-2">
                        <Select value={severityFilter} onValueChange={setSeverityFilter}>
                            <SelectTrigger className="flex items-center gap-2 border rounded-full px-4 py-2 border-gray-200 dark:border-gray-800">
                                <span>{severityFilter === 'all' ? 'Severity' : severityFilter.charAt(0).toUpperCase() + severityFilter.slice(1)}</span>
                                
                            </SelectTrigger>
                            <SelectContent align="start">
                                <SelectItem value="all">Severity</SelectItem>
                                <SelectItem value="critical">Critical</SelectItem>
                                <SelectItem value="warning">Warning</SelectItem>
                                <SelectItem value="valid">Valid</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
            {loading ? <div className="flex justify-center"><Progress className="w-[200px]" value={progress} /></div> : (
                <>
                    <DataTable 
                        data={filteredData}
                        statusFilter={statusFilter}
                        onStatusFilterChange={setStatusFilter}
                        onRowSelect={(row) => {
                            setSelectedRow(row);
                            setModalOpen(true);
                        }}
                    />

                    <ErrorSummaryDialog 
                        open={modalOpen}
                        onOpenChange={setModalOpen}
                        selectedRow={selectedRow || null}
                    />
                </>
            )}
        </div>
    );
}
