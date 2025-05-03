import { ConsumePantryItemDtoSchema, CookingMeasurement, IConsumePantryItemDto, Weights, getCookingMeasurement } from "@biaplanner/shared";
import { Controller, useForm } from "react-hook-form";
import React, { useCallback, useEffect, useState } from "react";
import { useConsumePantryItemMutation, useGetPantryItemQuery } from "@/apis/PantryItemsApi";
import { usePantryItemsCrudListActions, usePantryItemsCrudListState } from "../reducers/PantryItemsCrudListReducer";

import Button from "react-bootstrap/Button";
import CookingMeasurementInput from "@/features/product-catalogue/_products/components/CookingMeasurementInput";
import { Form } from "react-bootstrap";
import MeasurementInput from "@/features/recipe-management/_recipes/components/MeasurementInput";
import Modal from "react-bootstrap/Modal";
import TextInput from "@/components/forms/TextInput";
import useSimpleStatusToast from "@/hooks/useSimpleStatusToast";
import useValidationErrorToast from "@/components/toasts/ValidationErrorToast";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ConsumeItemModal() {
  const { consumePantryItemModal } = usePantryItemsCrudListState();

  const [consumeItem, { isSuccess: isConsumptionSuccess, isError: isConsumptionError, isLoading: isConsumptionPending, error }] = useConsumePantryItemMutation();

  const isOpen = consumePantryItemModal?.isOpen ?? false;

  const pantryItemId = consumePantryItemModal?.pantryItemId ?? null;

  const { closeConsumePantryItemModal } = usePantryItemsCrudListActions();
  const {
    data: pantryItem,
    isLoading,
    isError,
    isSuccess,
  } = useGetPantryItemQuery(String(pantryItemId), {
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
    skip: !pantryItemId,
  });

  const { notify: notifyConsumption } = useSimpleStatusToast({
    idPrefix: "consume-pantry-item",
    successMessage: "Pantry item consumed successfully",
    errorMessage: "Error consuming pantry item",
    loadingMessage: "Consuming pantry item...",
    isSuccess: isConsumptionSuccess,
    isError: isConsumptionError,
    isLoading: isConsumptionPending,
    onSuccess: () => {
      // closeConsumePantryItemModal();
    },
    onFailure: () => {
      console.log("Error consuming pantry item");
      console.log(error);
    },
  });

  console.log("ConsumeItemModal", { pantryItemId, isOpen, pantryItem });

  const methods = useForm<IConsumePantryItemDto>({
    defaultValues: {
      measurement: {
        magnitude: 0,
        unit: pantryItem?.product?.measurement.unit ?? Weights.GRAM,
      },

      pantryItemId: pantryItemId ?? undefined,
    },
    mode: "onBlur",
    resolver: zodResolver(ConsumePantryItemDtoSchema),
  });

  const { onSubmitError } = useValidationErrorToast();

  const onSubmitSuccess = useCallback(
    async (data: IConsumePantryItemDto) => {
      notifyConsumption();
      await consumeItem({
        id: String(data.pantryItemId),
        dto: data,
      });
    },
    [consumeItem, notifyConsumption]
  );

  useEffect(() => {
    if (pantryItemId) {
      methods.setValue("pantryItemId", String(pantryItemId));
    }
  }, [methods, pantryItemId]);

  if (isLoading || !pantryItemId) {
    return (
      <Modal show={isOpen} onHide={closeConsumePantryItemModal} backdrop="static" scroll>
        <Modal.Header closeButton>
          <Modal.Title>Consume Pantry Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>Loading...</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeConsumePantryItemModal}>
            Cancel
          </Button>
          <Button variant="primary" disabled>
            Consume
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <Modal show={isOpen} onHide={closeConsumePantryItemModal} backdrop="static" scroll>
      <Form onSubmit={methods.handleSubmit(onSubmitSuccess, onSubmitError)}>
        <Modal.Header closeButton>
          <Modal.Title>Consume Pantry Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoading && <div>Loading...</div>}
          {isError && <div>Error</div>}
          {isSuccess && pantryItem && (
            <>
              <h5>{pantryItem.product?.name}</h5>
              <p>
                Available Quantity: {pantryItem.availableMeasurements?.magnitude} {pantryItem.availableMeasurements?.unit}
              </p>
              <p>
                Consumed Quantity: {pantryItem.consumedMeasurements?.magnitude} {pantryItem.product?.measurement.unit}
              </p>

              <Controller name="measurement.magnitude" control={methods.control} render={({ field, fieldState }) => <TextInput type="number" label="Quantity to Consume" placeholder="Quantity" {...field} isInvalid={Boolean(fieldState.error)} />} />

              <Controller
                name="measurement.unit"
                control={methods.control}
                render={({ field, fieldState }) => (
                  <MeasurementInput
                    {...field}
                    labelField="Unit"
                    selectedValues={[getCookingMeasurement(field.value ?? pantryItem.product?.measurement.unit)]}
                    onChange={([value]) => {
                      field.onChange(value.unit as CookingMeasurement["unit"]);
                    }}
                  />
                )}
              />
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeConsumePantryItemModal}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Consume
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
