import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/ui/table"
import { Button } from "@/src/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/src/components/ui/tooltip"
import CheckCircleIcon  from "@mui/icons-material/CheckCircle"
import CancelIcon from "@mui/icons-material/Cancel"
import PendingIcon from "@mui/icons-material/Pending"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/src/components/ui/select"
import FilterAltIcon from '@mui/icons-material/FilterAlt';

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
    statusFilter: string;
    onStatusFilterChange: (value: string) => void;
}

export function DataTable({ data, statusFilter, onStatusFilterChange }: DataTableProps) {
    const getCellColor = (value: string, validation: ValidationError) => {
        if (!validation) return <div className="font-mono text-xs bg-green-50 text-green-700 px-2 py-0.5">{renderCellWithTooltip(value, validation)}</div>;
        if (validation.severity == "critical") {
            return <div className="font-mono text-xs border-2 border-red-500 bg-red-50 text-red-700 rounded-md px-2 py-0.5">{renderCellWithTooltip(value, validation)}</div>;
        } else if (validation.severity == "warning") {
            return <div className="font-mono text-xs border-2 border-yellow-500 bg-yellow-50 text-yellow-700 rounded-md px-2 py-0.5">{renderCellWithTooltip(value, validation)}</div>;
        } else {
            return <div className="font-mono text-xs border-2 border-green-500 bg-green-50 text-green-700 rounded-md px-2 py-0.5">{renderCellWithTooltip(value, validation)}</div>;
        }
    };

    const renderCellWithTooltip = (content: React.ReactNode, validation?: ValidationError) => {
        if (!validation || validation.severity === 'valid') {
            return <div>{content}</div>;
        }

        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div>
                            {content === '' ? 
                                <i>
                                    {validation.message.toLowerCase().includes('missing') ? 'Missing' :
                                     validation.message.toLowerCase().includes('invalid') ? 'Invalid' : 
                                     content}
                                </i> 
                                : content}
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{validation.message}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
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
                    <TableHead>
                        <div className="flex items-center gap-2">
                            Status
                            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                                <SelectTrigger className="w-[20px] h-[20px] border-0 p-0 hover:bg-accent hover:text-accent-foreground">
                                    <FilterAltIcon className="h-4 w-4" />
                                </SelectTrigger>
                                <SelectContent align="start">
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </TableHead>
                    <TableHead>Error Summary</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((record) => (
                    <TableRow key={record.id}>
                        <TableCell>
                            {/* {getCellColor(record.id, record.errors?.id)} */}
                            <div className="font-mono text-xs">{record.id}</div>
                        </TableCell>
                        <TableCell>
                            {/* {getCellColor(record.name, record.errors?.name)} */}
                            <div className="font-mono text-xs">{record.name}</div>
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
                            {/* {getCellColor(record.status, record.errors?.status)} */}
                            <div className="flex items-center gap-2">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            {record.status === "active" && <CheckCircleIcon className="text-green-500 w-4 h-4" />}
                                            {record.status === "pending" && <PendingIcon className="text-yellow-500 w-4 h-4" />}
                                            {record.status === "inactive" && <CancelIcon className="text-red-500 w-4 h-4" />}
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="capitalize">{record.status}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
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
