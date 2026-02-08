import { useEffect, useState } from "react";
import axios from "axios";
import { 
  FiRefreshCw, 
  FiMessageSquare, 
  FiPhone, 
  FiCheckCircle, 
  FiClock, 
  FiAlertCircle,
  FiChevronRight,
  FiTrash2,
  FiFilter,
  FiSearch
} from "react-icons/fi";

const MessageList = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/messages",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessages(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load messages");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMessages();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/messages/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        fetchMessages();
      } catch (error) {
        alert("Failed to delete message");
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "sent":
      case "delivered":
        return <FiCheckCircle className="w-5 h-5 text-green-500" />;
      case "pending":
      case "sending":
        return <FiClock className="w-5 h-5 text-yellow-500" />;
      case "failed":
      case "error":
        return <FiAlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <FiClock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "sent":
      case "delivered":
        return "bg-green-100 text-green-800";
      case "pending":
      case "sending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = 
      msg.phone_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message_text?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      statusFilter === "all" || 
      msg.message_status?.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="bg-blue-100 p-3 rounded-xl mr-4">
            <FiMessageSquare className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Message History
            </h2>
            <p className="text-gray-600 mt-1">
              View and manage all sent messages
            </p>
          </div>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={loading || refreshing}
          className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiRefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Messages</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{messages.length}</p>
            </div>
            <FiMessageSquare className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {messages.filter(m => m.message_status?.toLowerCase() === 'delivered').length}
              </p>
            </div>
            <FiCheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {messages.filter(m => m.message_status?.toLowerCase() === 'pending').length}
              </p>
            </div>
            <FiClock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {messages.filter(m => m.message_status?.toLowerCase() === 'failed').length}
              </p>
            </div>
            <FiAlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by phone number or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <FiFilter className="w-5 h-5 text-gray-400 mr-2" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="sent">Sent</option>
                <option value="delivered">Delivered</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && !refreshing && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredMessages.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow border border-gray-200">
          <FiMessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {searchTerm || statusFilter !== "all" ? "No matching messages" : "No messages found"}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || statusFilter !== "all" 
              ? "Try adjusting your search or filter" 
              : "Send your first message to get started"}
          </p>
          {searchTerm || statusFilter !== "all" ? (
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear filters
            </button>
          ) : null}
        </div>
      )}

      {/* Messages List */}
      {!loading && filteredMessages.length > 0 && (
        <div className="space-y-4">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <FiPhone className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="font-medium text-gray-700">Phone:</span>
                      <span className="ml-2 text-gray-900 font-mono">
                        {msg.phone_number}
                      </span>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex items-start">
                        <FiMessageSquare className="w-4 h-4 text-gray-400 mr-2 mt-1 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-gray-700">Message:</span>
                          <p className="mt-1 text-gray-800 whitespace-pre-wrap">
                            {msg.message_text}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 mt-4 md:mt-0">
                    <div className="flex flex-col items-end">
                      <div className="flex items-center">
                        {getStatusIcon(msg.message_status)}
                        <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(msg.message_status)}`}>
                          {msg.message_status || "Unknown"}
                        </span>
                      </div>
                      
                      {msg.sent_at && (
                        <p className="text-sm text-gray-500 mt-2">
                          {new Date(msg.sent_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete message"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Message ID: <span className="font-mono">{msg.id}</span>
                    </div>
                    <FiChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageList;