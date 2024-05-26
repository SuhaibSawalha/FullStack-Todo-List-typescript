import { useQueryClient, useMutation } from "react-query";

const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (id: number) => {
      const response = await fetch("http://localhost:3001/api/todos/" + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("todos");
      },
    }
  );

  const deleteTodo = (id: number) => {
    mutation.mutate(id);
  };

  return { deleteTodo };
};

export default useDeleteTodo;
