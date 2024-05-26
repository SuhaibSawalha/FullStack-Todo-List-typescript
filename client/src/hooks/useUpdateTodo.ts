import { useQueryClient, useMutation } from "react-query";

const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (id: number) => {
      const response = await fetch("http://localhost:3001/api/todos/" + id, {
        method: "PUT",
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

  const updateTodo = (id: number) => {
    mutation.mutate(id);
  };

  return { updateTodo };
};

export default useUpdateTodo;
