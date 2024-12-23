"use client";
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import SprintManager from "./SprintManager";
import status from "@/data/status.json";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { IssueDrawer } from "./IssueDrawer";
import useFetch from "@/hooks/useFetch";
import { getIssueForSprint, updateIssueStatus } from "@/actions/issues";
import { HashLoader, PulseLoader } from "react-spinners";
import IssueCard from "./IssueCard";
import { toast } from "sonner";
import BoardFilters from "./BoardFilters";

const reOrder = (
  list: Iterable<unknown> | ArrayLike<unknown>,
  startIndex: number | undefined,
  endIndex: number | undefined
) => {
  const result = Array.from(list);
  const [removed] = result.slice(startIndex, 1);
  // @ts-ignore
  result.slice(endIndex, 0, removed);
  return result;
};

const SprintBoard = ({ sprints, projectId, orgId }: any) => {
  const [currentSprint, setCurrentSprint] = useState(
    sprints.find((spr: any) => spr.status === "ACTIVE" || sprints[0])
  );

  const {
    loading: getIssuesLoading,
    error: gettingIssuesError,
    func: fetchIssues,
    data: issues,
    setData: setIssues,
  } = useFetch(getIssueForSprint);

  const {
    loading: updateIssueLoading,
    error: updateIssueError,
    func: updateIssueOrderFn,
  } = useFetch(updateIssueStatus);

  useEffect(() => {
    if (currentSprint) {
      fetchIssues(currentSprint);
    }
  }, [currentSprint.id]);

  const [filterdIssues, setfilterdIssues] = useState(issues);

  const handleFilterChange = (newFilterIssues: any) => {
    setfilterdIssues(newFilterIssues);
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStatus, setselectedStatus] = useState(null);

  const onDragEnd = async (result: any) => {
    if (currentSprint.status === "PLANNED") {
      toast.warning("Start The Sprint To Update Board");
      return;
    }
    if (currentSprint.status === "COMPLETED") {
      toast.warning("Cannot Update Board After Sprint End");
      return;
    }

    const { destination, source } = result;

    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newOrderedData = [...issues];

    // source and destination list
    const sourceList = newOrderedData.filter(
      (list) => list.status === source.droppableId
    );

    const destinationList = newOrderedData.filter(
      (list) => list.status === destination.droppableId
    );

    if (source.droppableId === destination.droppableId) {
      const reorderedCards = reOrder(
        sourceList,
        source.index,
        destination.index
      );

      reorderedCards.forEach((card: any, i) => {
        card.order = i;
      });
    } else {
      // remove card from the source list
      const [movedCard] = sourceList.splice(source.index, 1);

      // assign the new list id to the moved card
      movedCard.status = destination.droppableId;

      // add new card to the destination list
      destinationList.splice(destination.index, 0, movedCard);

      sourceList.forEach((card, i) => {
        card.order = i;
      });

      // update the order for each card in destination list
      destinationList.forEach((card, i) => {
        card.order = i;
      });
    }

    const sortedIssues: any = newOrderedData.sort((a, b) => a.order - b.order);
    // @ts-expect-error
    setIssues(newOrderedData, sortedIssues);

    updateIssueOrderFn(sortedIssues);
  };

  const handleAddButton = (status: any) => {
    setselectedStatus(status);
    setIsDrawerOpen(true);
  };

  const handleIssueCreated = () => {
    fetchIssues(currentSprint);
  };

  if (gettingIssuesError) return <div>Error While Loading Issues.</div>;

  return (
    <div>
      {/* Sprint Manager */}
      <SprintManager
        currentSprint={currentSprint}
        setCurrentSprint={setCurrentSprint}
        sprints={sprints}
        projectId={projectId}
      />

      {issues && !getIssuesLoading && (
        <BoardFilters issues={issues} onFilterChange={handleFilterChange} />
      )}

      {updateIssueError && (
        <p className="text-red-500 mt-2 ">{updateIssueError?.message}</p>
      )}
      {(updateIssueError || getIssuesLoading) && (
        <PulseLoader color="#6e39ae" size={"10"} className="text-center mt-4" />
      )}

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 bg-slate-900 p-4 rounded-lg mx-8">
          {status.map((col: any) => (
            <Droppable key={col.key} droppableId={col.key}>
              {(provided: any) => {
                return (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    <h3 className="text-center font-semibold mb-2 ">
                      {col.name}
                    </h3>

                    {/* Issues */}
                    {filterdIssues
                      ?.filter((issue: any) => issue.status === col.key)
                      .map((issue: any, index: any) => (
                        <Draggable
                          key={issue.id}
                          draggableId={issue.id}
                          index={index}
                          isDragDisabled={updateIssueLoading}
                        >
                          {(provided) => {
                            return (
                              <>
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <IssueCard
                                    issue={issue}
                                    onDelete={() =>
                                      fetchIssues(currentSprint.id)
                                    }
                                    onUpdate={(updated: any) => {
                                      setIssues((issues: any) =>
                                        issues.map((issue: any) => {
                                          if (issue.id === updated.id)
                                            return updated;
                                          return issue;
                                        })
                                      );
                                    }}
                                  />
                                </div>
                              </>
                            );
                          }}
                        </Draggable>
                      ))}

                    {provided.placeholder}
                    {col.key === "TODO" &&
                      currentSprint.status !== "COMPLETED" && (
                        <Button
                          variant="ghost"
                          className="w-full"
                          onClick={() => {
                            handleAddButton(col.key);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create Issue
                        </Button>
                      )}
                  </div>
                );
              }}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <IssueDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
        }}
        sprintId={currentSprint.id}
        status={selectedStatus}
        projectId={projectId}
        onIssueCreated={handleIssueCreated}
        orgId={orgId}
      />
    </div>
  );
};

export default SprintBoard;
