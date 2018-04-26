import React, {Component} from 'react';
import {connect} from 'react-redux';
import {getUser, getTeacher} from '../../../redux/user';


class TeachHome extends Component {
    render(){
        console.log(this.props.teacher)
        return (
        <div className="course-container">            
            <div className="left-column">
                <h1 className="course-title">{`Welcome to Homeroom`}</h1>
                {"All schools in the Salt Lake City District use Homeroom as the Learning Management System (LMS), which means all of your online courses will be in Homeroom. The course content will be available by the first day of classes."}
                <h1 className="course-title">{`Homeroom Recommendations`}</h1>
                {"Nothing to display"}
                <h1 className="course-title">{`Teachers Recommendations`}</h1>
                {"Nothing to display"}
            </div>
            <div className="right-column">
            
            </div>
        </div> 
        )
    }
}

function mapStateToProps(state){
    return{
          user: state.user
        , teacher: state.teacher
    }
}
export default connect(mapStateToProps, {getUser, getTeacher})(TeachHome);