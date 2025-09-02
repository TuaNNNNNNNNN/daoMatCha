
import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useData } from '../../hooks/useData';

const SendFeedback: React.FC = () => {
    const { auth, addFeedback } = useData();
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !auth.user) return;
        
        addFeedback({
            employeeId: auth.user.id,
            message: message.trim(),
        });

        setMessage('');
        setStatus('Phản hồi của bạn đã được gửi. Cảm ơn bạn!');
        setTimeout(() => setStatus(''), 3000);
    };

    return (
        <Card title="Gửi phản hồi cho quản trị viên">
            <form onSubmit={handleSubmit} className="space-y-4">
                {status && <p className="text-green-600 text-center">{status}</p>}
                <div>
                    <label htmlFor="feedback-message" className="block text-sm font-medium text-gray-700 mb-2">
                        Nội dung phản hồi
                    </label>
                    <textarea
                        id="feedback-message"
                        rows={6}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                        placeholder="Nhập nội dung bạn muốn gửi..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    />
                </div>
                <Button type="submit" className="w-full">
                    Gửi phản hồi
                </Button>
            </form>
        </Card>
    );
};

export default SendFeedback;
