const useApi = () => {
  const fetchPosts = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/createposts");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  return { fetchPosts };
};
export default useApi;
