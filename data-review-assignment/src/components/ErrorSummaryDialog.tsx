'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog"
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';

interface ValidationError {
    message: string;
    severity: 'critical' | 'warning' | 'valid';
}

interface SelectedRow {
    id: string;
    data: Record<string, any>;
    validations: Record<string, ValidationError>;
}

interface ErrorSummaryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedRow: SelectedRow | null;
}

export function ErrorSummaryDialog({ open, onOpenChange, selectedRow }: ErrorSummaryDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-black [&>button]:dark:text-white" >
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-500 dark:text-white font-mono">Error Summary ID:{selectedRow?.id}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                    {selectedRow && Object.entries(selectedRow.validations || {}).map(([field, validation]) => (
                        validation && (validation.severity === 'critical' || validation.severity === 'warning') && (
                            <div 
                                key={field} 
                                className={`p-4 rounded-lg font-mono ${
                                    validation.severity === 'critical' 
                                        ? 'bg-red-200 border border-red-500 dark:bg-red-900/20' 
                                        : 'bg-yellow-100 border border-yellow-500 dark:bg-yellow-900/20'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">
                                        {validation.severity === 'critical' 
                                            ? <ErrorIcon className="text-red-500" /> 
                                            : <WarningIcon className="text-yellow-500" />}
                                    </span>
                                    
                                    {validation.severity === 'critical' 
                                            ? <h4 className="font-semibold capitalize text-red-800 font-mono">{field}</h4>
                                            : <h4 className="font-semibold capitalize text-yellow-800 font-mono">{field}</h4>}
                                        
                                    
                                    <span className={`text-xs px-2 py-1 rounded-full ml-auto font-mono ${
                                        validation.severity === 'critical'
                                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                            : 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                    }`}>
                                        {validation.severity}
                                    </span>
                                </div>
                                <p className={`mt-2 text-sm font-mono ${
                                    validation.severity === 'critical'
                                        ? 'text-red-900 dark:text-red-900'
                                        : 'text-yellow-900 dark:text-yellow-900'
                                }`}>
                                    {validation.message}
                                </p>
                            </div>
                        )
                    ))}
                    {selectedRow && 
                        Object.values(selectedRow.validations || {}).every(v => !v || v.severity === 'valid') && (
                        <div className="p-4 rounded-lg bg-green-50 border border-green-200 dark:bg-green-900/20">
                            <p className="text-green-700 dark:text-green-200 font-mono">
                                No validation errors found for this record.
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
