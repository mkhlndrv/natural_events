import { useParams } from 'react-router-dom';

function EventDetail() {
  const { id } = useParams();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Event Detail</h1>
      <p className="mt-2 text-gray-600">Showing details for event: {id}</p>
    </div>
  );
}

export default EventDetail;
