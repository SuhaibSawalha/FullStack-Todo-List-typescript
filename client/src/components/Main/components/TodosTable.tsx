import { useGetTodos } from "../../../hooks";
import Todo from "./Todo";
import { useContext } from "react";
import { SearchContext } from "../../../contexts";
import { Todo as TodoType } from "../../../../../models";

const TodosTable = () => {
  const { search } = useContext(SearchContext);
  const { todos, isLoading, error } = useGetTodos();

  return (
    <div className="todo-table">
      <div className="todo-row todo-list-titles">
        <p>ID</p>
        <p>TODO</p>
        <p>Status</p>
        <p>Actions</p>
      </div>
      {isLoading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <h2>{String(error)}</h2>
      ) : (
        <div className="todo-list">
          {todos.map(
            (todo: TodoType) =>
              todo.todo.toLowerCase().includes(search.toLowerCase()) && (
                <Todo key={todo._id} todo={todo} />
              )
          )}
        </div>
      )}
    </div>
  );
};

export default TodosTable;
