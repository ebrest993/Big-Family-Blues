import React from "react";
import Joi from "joi-browser";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Input from "../../components/Common/input.jsx";
import Form from "../../components/Common/form.jsx";
import http from "../../services/httpService";
import { api } from "../../config.js";
import { createpost } from "../../services/postCreateService.js";

import "./style.scss";

class NewPost extends Form {
  state = {
    data: { title: "", description: "", tags: [] },
    errors: { title: "", description: "", tags: [] },
    tags: [],
  };
  schema = {
    title: Joi.string().required().min(10).label("Title"),
    description: Joi.string().required().min(5).label("Description"),
    tags: Joi.array(),
  };
  handleTagChange = (tagID) => {
    console.log("hello");
    let data = this.state.data;
    const newtags = data.tags;
    const index = newtags.indexOf(tagID);
    if (index === -1) newtags.push(tagID);
    else newtags.splice(index, 1);
    data = {
      title: data.title,
      description: data.description,
      tags: newtags,
    };
    console.log(data);
    this.setState({ data });
  };
  async componentDidMount() {
    let tags = await http.get(api.tagsEndPoint);
    try {
      this.setState({ tags: tags.data });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error("Post Validation Failed!");
      }
    }
  }
  doSubmit = async () => {
    try {
      const { data } = this.state;
      const { response } = await createpost(data);
      console.log(response);
      window.location = "/dashboard";
    } catch (ex) {}
  };
  render() {
    const { data, errors, tags } = this.state;
    return (
      <React.Fragment>
        <ToastContainer />
        <div className="container-lg">
          <h1 className="text-center m-2">Create a New Discussion</h1>
          <div
            className="container m-4 p-4 rounded"
            style={{ backgroundColor: "#F1F1F1" }}
          >
            <form onSubmit={this.handleSubmit}>
              <Input
                value={data.title}
                onChange={this.handleChange}
                label="Title"
                name="title"
                type="text"
                error={errors.title}
                className="form-control"
              />
              <Input
                value={data.title}
                onChange={this.handleChange}
                label="Members"
                name="members"
                type="text"
                error={errors.title}
                className="form-control"
              />
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  value={data.description}
                  onChange={this.handleChange}
                  name="description"
                  type="description"
                  id="description"
                  className="form-control"
                />
                {errors.description && (
                  <div className="alert-info">{errors.description}</div>
                )}
              </div>
              <div className="text-center">
                <button
                  className="btn btn-primary mt-4"
                  disabled={this.validate()}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default NewPost;
