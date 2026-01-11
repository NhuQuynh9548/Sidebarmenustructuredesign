import { useState, useEffect, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { GripVertical } from 'lucide-react';

export interface ColumnConfig {
  id: string;
  label: string;
  field?: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
  visible: boolean;
}

interface UseDraggableColumnsProps {
  defaultColumns: ColumnConfig[];
  storageKey: string;
  userId?: string;
}

export function useDraggableColumns({ 
  defaultColumns, 
  storageKey,
  userId = 'default'
}: UseDraggableColumnsProps) {
  // Column order state with localStorage persistence
  const [columns, setColumns] = useState<ColumnConfig[]>(() => {
    try {
      const saved = localStorage.getItem(`${storageKey}-${userId}`);
      return saved ? JSON.parse(saved) : defaultColumns;
    } catch {
      return defaultColumns;
    }
  });

  // Save column config to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${storageKey}-${userId}`, JSON.stringify(columns));
    } catch (error) {
      console.error('Failed to save column config:', error);
    }
  }, [columns, storageKey, userId]);

  // Move column function for drag & drop
  const moveColumn = (fromIndex: number, toIndex: number) => {
    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      const [movedColumn] = newColumns.splice(fromIndex, 1);
      newColumns.splice(toIndex, 0, movedColumn);
      return newColumns;
    });
  };

  // Reset to default
  const resetColumns = () => {
    if (window.confirm('Đặt lại thứ tự cột về mặc định?')) {
      setColumns(defaultColumns);
    }
  };

  return {
    columns,
    setColumns,
    moveColumn,
    resetColumns
  };
}

interface DraggableColumnHeaderProps {
  column: ColumnConfig;
  index: number;
  moveColumn: (fromIndex: number, toIndex: number) => void;
  onSort?: (field: string) => void;
  sortField?: string | null;
  sortOrder?: 'asc' | 'desc' | null;
  renderSortIcon?: (field: string) => React.ReactNode;
}

export function DraggableColumnHeader({ 
  column, 
  index, 
  moveColumn,
  onSort,
  sortField,
  sortOrder,
  renderSortIcon
}: DraggableColumnHeaderProps) {
  const ref = useRef<HTMLTableCellElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'COLUMN',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'COLUMN',
    hover: (item: { index: number }) => {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveColumn(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drag(drop(ref));

  const alignClass = 
    column.align === 'center' ? 'text-center' :
    column.align === 'right' ? 'text-right' : 'text-left';

  const canSort = column.sortable && column.field && onSort;

  return (
    <th
      ref={ref}
      className={`px-6 py-4 ${alignClass} ${
        isDragging ? 'opacity-30 bg-blue-50' : ''
      } ${isOver ? 'bg-blue-100' : ''} transition-all cursor-move`}
    >
      <div className="flex items-center gap-2">
        <div className="hover:bg-gray-200 rounded p-1 transition-colors" title="Kéo để sắp xếp">
          <GripVertical className="w-3 h-3 text-gray-400" />
        </div>
        {canSort ? (
          <button
            onClick={() => onSort && column.field && onSort(column.field)}
            className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-[#1E6BB8] transition-colors"
          >
            {column.label}
            {renderSortIcon && column.field && renderSortIcon(column.field)}
          </button>
        ) : (
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            {column.label}
          </span>
        )}
      </div>
    </th>
  );
}
