import "../styles/DualPaneForm.scss";

import Col, { ColProps } from "react-bootstrap/esm/Col";
import Form, { FormProps } from "react-bootstrap/Form";
import Row, { RowProps } from "react-bootstrap/esm/Row";

import Container from "react-bootstrap/Container";
import { HTMLProps } from "react";
import Heading from "../Heading";
import React from "react";

export type DualPaneFormMainProps = FormProps;
export type DualPaneFormTitleProps = HTMLProps<HTMLHeadingElement>;
export type DualPaneFormHeaderProps = ColProps;
export type DualPaneFormPaneProps = ColProps;
export type DualPaneFormPanelProps = RowProps;

function Title(props: DualPaneFormTitleProps) {
  const { className, children, ...rest } = props;
  return (
    <Heading level={Heading.Level.H1} className={`bp-form__header__title ${className ?? " "}`} {...rest}>
      {children}
    </Heading>
  );
}

function Actions(props: HTMLProps<HTMLDivElement>) {
  const { className, children, ...rest } = props;
  return (
    <div className={`bp-form__header__actions ${className ?? ""}`} {...rest}>
      {children}
    </div>
  );
}

function Header(props: DualPaneFormHeaderProps) {
  const { className, children, ...rest } = props;
  return (
    <Row>
      <Col className={`bp-form__header ${className ?? ""}`} {...rest}>
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return null;
          else if (child.type === Title) return <div>{child}</div>;
          else if (child.type === Actions) return <div>{child}</div>;
          else {
            return null;
          }
        })}
      </Col>
    </Row>
  );
}

function Pane(props: DualPaneFormPaneProps) {
  const { className, ...rest } = props;
  return <Col className={`bp-form__dual_panel__pane ${className ?? ""}`} {...rest} />;
}

function Panel(props: DualPaneFormPanelProps) {
  const { className, children, ...rest } = props;
  return (
    <Row className={`bp-form__dual_panel ${className ?? ""}`} {...rest}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null;
        else if (child.type === Pane) return child;
        else {
          return null;
        }
      })}
    </Row>
  );
}

function Main(props: DualPaneFormMainProps) {
  const { className, children, ...rest } = props;
  return (
    <Form className={`bp-form ${className ?? ""}`} {...rest}>
      <Container fluid>
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return null;
          else if (child.type === Header) return child;
          else if (child.type === Panel) return child;
          else {
            return null;
          }
        })}
      </Container>
    </Form>
  );
}

Header.Title = Title;
Header.Actions = Actions;
Panel.Pane = Pane;
Main.Header = Header;
Main.Panel = Panel;

const DualPaneForm = Main;

export default DualPaneForm;

// return (<Form
//         className="bp-recipe_form"
//         onSubmit={handleSubmit(() => {
//           const dto = getValues();
//           console.log(dto);
//           onSubmit(dto);
//         })}
//       >
//         <Container fluid>
//           <Row>
//             <Col className="bp-recipe_form__header">
//               <h1 className="bp-recipe_form__header__title">{type === "create" ? "Create Recipe" : "Update Recipe"}</h1>
//               <div className="bp-recipe_form__header__actions">
//                 <Button type="button" variant="outline-secondary" onClick={() => navigate(-1)}>
//                   <MdCancel />
//                   <span className="ms-2">Cancel</span>
//                 </Button>
//                 <Button type="submit" disabled={disableSubmit}>
//                   <FaSave />
//                   <span className="ms-2">Save recipe</span>
//                 </Button>
//               </div>
//             </Col>
//           </Row>
//           <Row className="bp-recipe_form__dual_panel">
//             <Col className="bp-recipe_form__dual_panel__pane" md={4}>
//               <h2 className="bp-recipe_form__dual_panel__pane_heading">Recipe General Information</h2>
//               <ImageSelector helpText="Upload a cover image for this recipe. Recommended image dimensions are 1200 x 800 px." />
//               <div className="bp-recipe_form__dual_panel__pane__general_info">
//                 <TextInput
//                   label="Recipe title"
//                   defaultValue={initialValue?.title}
//                   inputLabelProps={{ required: true }}
//                   error={formState.errors.title?.message}
//                   onChange={(e) => {
//                     const { value } = e.target;
//                     setValue("title", value);
//                   }}
//                 />
//                 <DifficultyLevelSelect
//                   onChange={(value) => {
//                     setValue("difficultyLevel", value);
//                   }}
//                   initialValue={initialValue?.difficultyLevel}
//                   inputLabelProps={{ required: true }}
//                   error={formState.errors.difficultyLevel?.message === "Required" ? "Difficulty level is required" : formState.errors.difficultyLevel?.message}
//                 />
//                 <CuisineSelect
//                   onChange={(value) => {
//                     setValue("cuisineId", value.id);
//                   }}
//                   initialValueId={String(initialValue?.cuisine?.id)}
//                   inputLabelProps={{ required: true }}
//                   error={formState.errors.cuisineId?.message === "Required" ? "Cuisine is required" : formState.errors.cuisineId?.message}
//                 />
//                 <Form.Group>
//                   <InputLabel required>Preparation time</InputLabel>
//                   <SegmentedTimeInput
//                     onChange={(segmentedTime) => {
//                       setValue("prepTime", segmentedTime);
//                     }}
//                     initialValue={initialValue?.prepTime}
//                   />
//                 </Form.Group>
//                 <Form.Group>
//                   <InputLabel required>Cooking time</InputLabel>
//                   <SegmentedTimeInput
//                     onChange={(segmentedTime) => {
//                       setValue("cookingTime", segmentedTime);
//                     }}
//                     initialValue={initialValue?.cookingTime}
//                   />
//                 </Form.Group>
//                 <RecipeTagsMultiselect
//                   inputLabelProps={{ required: true }}
//                   initialValues={initialValue?.tags}
//                   onChange={(tags) => {
//                     setValue(
//                       "tags",
//                       tags.map((tag) => ({
//                         id: tag.id,
//                       }))
//                     );
//                   }}
//                   error={formState.errors.tags?.message}
//                 />
//                 <TextInput
//                   label="Recipe Description"
//                   defaultValue={initialValue?.description}
//                   onChange={(e) => {
//                     const { value } = e.target;
//                     setValue("description", value);
//                   }}
//                   as="textarea"
//                 />
//               </div>
//             </Col>
//             <Col className="bp-recipe_form__dual_panel__pane">
//               <h2 className="bp-recipe_form__dual_panel__pane_heading">Recipe Details</h2>

//               <IngredientList />
//               <TextInput
//                 formGroupClassName="mt-5"
//                 label="Instructions"
//                 defaultValue={initialValue?.instructions}
//                 onChange={(e) => {
//                   const { value } = e.target;
//                   setValue("instructions", value);
//                 }}
//                 as="textarea"
//               />
//             </Col>
//           </Row>
//         </Container>
//       </Form>)
