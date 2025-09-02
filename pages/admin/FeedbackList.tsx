
import React from 'react';
import { useData } from '../../hooks/useData';
import Card from '../../components/ui/Card';
import { formatDateTime } from '../../utils/date';

const FeedbackList: React.FC = () => {
    const { feedback } = useData();
    
    const sortedFeedback = [...feedback].sort((a,b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    return (
        <Card title="Phản hồi từ nhân viên">
            <div className="space-y-4">
                {sortedFeedback.length > 0 ? sortedFeedback.map(item => (
                    <div key={item.id} className="p-4 border rounded-lg bg-gray-50">
                        <p className="text-gray-800">{item.message}</p>
                        <div className="text-xs text-gray-500 mt-2 text-right">
                            - Gửi bởi <strong>{item.employeeName}</strong> lúc {formatDateTime(item.submittedAt)}
                        </div>
                    </div>
                )) : (
                    <p className="text-gray-500">Chưa có phản hồi nào.</p>
                )}
            </div>
        </Card>
    );
};

export default FeedbackList;
