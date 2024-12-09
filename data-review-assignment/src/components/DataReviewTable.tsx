// components/DataReview.tsx
import { useEffect, useState } from "react";
import { Progress } from "@/src/components/ui/progress"
import { ErrorSummaryDialog } from "@/src/components/ErrorSummaryDialog"
import { DataTable } from "@/src/components/DataTable";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/src/components/ui/select";

type SelectedRow = {
    id: string;
    data: Record<string, any>;
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

    return (
        <div className="p-8 dark:bg-black dark:text-white">
            <div className="flex flex-col items-center mb-4 space-y-4">
                <h1 className="font-mono text-xl font-bold">DATA REVIEW</h1>
                <div className="w-full flex justify-between items-center">
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
