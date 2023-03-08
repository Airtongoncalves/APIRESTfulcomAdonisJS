 import {v4 as uuidv4} from 'uuid';
 import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

 import Application from '@ioc:Adonis/Core/Application';
 import Moment from 'App/Models/Moment'

export default class MomentsController {
    private  validationsOptions = {
      type:['image'],
      size: '95mb'
    }
    public async store({request,response} : HttpContextContract){
      console.log('ola34');
      const body  = request.body();
      console.log('ola',body);
      const image  = request.file('image',this.validationsOptions)

      if(image){

        const imageName  = `${uuidv4()}.${image.extname}`
        await image.move(Application.tmpPath('uploads'),{
          name: imageName
        })
        body.image = imageName;
      }

      const moment  = await Moment.create(body);

      response.status(201);

      return {
        message: "Momento criado com sucesso",
        data: moment
      }

    }
    public async index(){
      console.log('ola3');
      const moments = await Moment.query().preload("comments")

      return {
       data: moments
      }
    }

    public  async show({params} : HttpContextContract){
        const moment = await Moment.findOrFail(params.id);
        await moment.load('comments')
        return {
          data: moment
        }
    }

    public  async destroy({params} : HttpContextContract){
      const moment = await Moment.findOrFail(params.id);
      console.log(moment);
      if(moment){
        await moment.delete()
        return {
          message:'Momento excluido com sucesso',
          data: moment,
        }
      }
      else
      {
        return {
          message:'Não encontramos esse momento!!!',
          data: moment,
        }
      }

  }
  public async update ({params,request} : HttpContextContract){

    const body   = request.body()
    const moment  = await Moment.findOrFail(params.id);

    moment.title = body.title
    moment.description = body.description

    if(moment.image !=  body.image || !moment.image){
      const image  = request.file('image',this.validationsOptions)

      if(image)
      {
        const imageName  = `${uuidv4()}.${image.extname}`
        await image.move(Application.tmpPath('uploads'),{
          name: imageName
        })


        moment.image = imageName;
      }

    }
    await moment.save()
    return {
      message: 'Moment atualizado com sucesso',
      data: moment,
    }
  }
}
